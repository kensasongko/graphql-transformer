import { AuthTransformer, NONE_DS } from "@aws-amplify/graphql-auth-transformer";
import { DefaultValueTransformer } from "@aws-amplify/graphql-default-value-transformer";
import {
  IndexTransformer,
  PrimaryKeyTransformer,
} from "@aws-amplify/graphql-index-transformer";
import { ModelTransformer } from "@aws-amplify/graphql-model-transformer";
import {
  BelongsToTransformer,
  HasManyTransformer,
  HasOneTransformer,
  ManyToManyTransformer,
} from "@aws-amplify/graphql-relational-transformer";
import { ConflictHandlerType, GraphQLTransform } from "@aws-amplify/graphql-transformer-core";
import {
  AppSyncAuthConfiguration,
  FeatureFlagProvider,
} from "@aws-amplify/graphql-transformer-interfaces";
import * as path from "path";
import * as fs from "fs-extra";
import { FunctionTransformer } from "@aws-amplify/graphql-function-transformer";
import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DeploymentResources } from "@aws-amplify/graphql-transformer-interfaces/src";
import {
  AppsyncFunction,
  AuthorizationType,
  BaseDataSource,
  DynamoDbDataSource,
  GraphqlApi,
  MappingTemplate,
  Resolver,
  SchemaFile,
  UserPoolDefaultAction,
} from "aws-cdk-lib/aws-appsync";
import {
  AccountRecovery,
  IUserPool,
  Mfa,
  UserPool,
} from "aws-cdk-lib/aws-cognito";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import pluralize = require("pluralize");
import { FeatureFlags } from "@aws-amplify/amplify-cli-core";

const TYPE_NAMES = ["Subscription", "Mutation", "Query"];

export interface SchemaTransformerStackProps extends StackProps {
  schemaDir: string;
  schemaSingleFileName: string;
  schemaMultiDirName: string;
  outDir: string;
  userPool?: IUserPool;
}

export class SchemaTransformerStack extends Stack {
  public props: SchemaTransformerStackProps;
  public transformer: GraphQLTransform;
  public stacks: Record<string, Stack>;
  public api: GraphqlApi;
  public dataSources: Record<string, BaseDataSource>;
  public tables: Record<string, Table>;
  public functions: Record<string, AppsyncFunction>;
  public resolvers: Record<string, Resolver>;
  public subcriptionAuthFunctions: Record<string, AppsyncFunction>;
  public disableSandboxFunction: Record<string, AppsyncFunction>;
  public dataSourceOutputs: Record<string, string>;
  public functionOutputs: Record<string, string>;

  constructor(
    scope: Construct,
    id: string,
    props: SchemaTransformerStackProps
  ) {
    super(scope, id, props);
    this.props = props;
    if (this.props.userPool === undefined) {
      this.props.userPool = this.createCognitoUserPool();
    }

    this.prepareOutputDir();
    const authConfig = this.getAuthConfig();
    const featureFlags = this.getFeatureFlags();
    this.transformer = this.getTransformer(authConfig, featureFlags);
    const fullSchema = this.getSchema();
    const deployment = this.transformer.transform(fullSchema);
    this.saveSchema(deployment);
    this.saveVtls(deployment);
    console.log(deployment.stackMapping);

    this.stacks = {};
    this.dataSources = {};
    this.tables = {};
    this.functions = {};
    this.resolvers = {};
    this.subcriptionAuthFunctions = {};
    this.dataSourceOutputs= {};
    this.functionOutputs = {};

    this.api = new GraphqlApi(this, "test_api", {
      name: "TestApi",
      schema: SchemaFile.fromAsset(
        path.join(this.props.outDir, "graphql.schema")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: this.props.userPool,
            defaultAction: UserPoolDefaultAction.ALLOW,
          },
        },
      },
    });
    this.dataSources[NONE_DS] = this.api.addNoneDataSource("none");

    for (const stackKey in deployment.stacks) {
      const stack = deployment.stacks[stackKey];
      this.stacks[stackKey] = new Stack(this, `${stackKey}Stack`, this.props);
      for (const resourceKey in stack.Resources) {
        const resource = stack.Resources[resourceKey];
        //console.log(`${stackKey} - ${resource.Type}`);
        switch (resource.Type) {
          case "AWS::DynamoDB::Table":
            this.tables[stackKey] = this.createTable(this, stackKey, resource);
            break;
          case "AWS::AppSync::DataSource":
            //console.log(`${stackKey}DataSource`);
            this.dataSources[`${stackKey}DataSource`] = this.createDataSource(
              stackKey,
              this.api,
              this.tables
            );
            break;
          case "AWS::AppSync::FunctionConfiguration":
            const functionName = resource.Properties.Name;
            //console.log(functionName);
            //console.log(resource.Properties.DataSourceName);
            this.functions[functionName] = this.generateFunction(
              this.stacks[stackKey],
              resource,
              this.dataSourceOutputs,
              this.api,
              functionName,
              this.dataSources,
            );
            break;
          case "AWS::AppSync::Resolver":
            const fieldName = resource.Properties.FieldName;
            const typeName = resource.Properties.TypeName;
            //console.log(resource.Properties.PipelineConfig.Functions);
            //console.log(resource.Properties.RequestMappingTemplate['Fn::Join'][1]);
            //console.log(`Type: ${typeName} - Field: ${fieldName}`);
            //this.resolvers[`${typeName}${fieldName}`] = 
            this.generateResolver(
              this.stacks[stackKey],
              this.api,
              resource,
              stackKey,
              fieldName,
              typeName
            );
            break;
        }
      }

      const outputs = stack.Outputs;
      if (outputs !== undefined) {
        this.parseOutputs(outputs);
      }

      //console.log(stack);
    }
    //console.log(this.functionOutputs);
  }
  
  parseOutputs(outputs: Record<string, any>) {
    for (const outputKey in outputs) {
      if (outputKey.startsWith('transformerrootstack')) {
        if (outputKey.endsWith('FunctionId') === false) {
          const getAtt = outputs[outputKey].Value['Fn::GetAtt'];
          if (getAtt !== undefined) {
            this.dataSourceOutputs[outputKey] = getAtt[0];
          }
        } else {
          //console.log(outputKey);
          const getAtt = outputs[outputKey].Value['Fn::GetAtt'][0];
          for (const functionKey in this.functions) {
            if (getAtt.startsWith(functionKey)) {
              this.functionOutputs[outputKey] = functionKey;
              break;
            }
          }
        }
      }
    }
  }

  generateFunction(context: Construct, resource: any, outputs: Record<string, string>, api: GraphqlApi, functionName: string, dataSources: Record<string, BaseDataSource>) {
    const properties = resource.Properties;
    const reqFile = properties.RequestMappingTemplateS3Location['Fn::Join'][1][4].split('/')[2];

    let responseMappingTemplate: MappingTemplate;
    const resString = properties.ResponseMappingTemplate;
    if (resString !== undefined) {
      responseMappingTemplate = MappingTemplate.fromString(resString);
    } else {
      responseMappingTemplate = MappingTemplate.fromFile(
        path.join(
          this.props.outDir,
          properties.ResponseMappingTemplateS3Location['Fn::Join'][1][4].split('/')[2]
        )
      );
    }

    let dataSource: BaseDataSource = dataSources[NONE_DS];
    const dataSourceAtt = properties.DataSourceName['Fn::GetAtt'];
    const dataSourceRef = properties.DataSourceName.Ref;

    if (dataSourceAtt !== undefined) {
      for (const dataSourceKey in dataSources) {
        if (dataSourceKey === dataSourceAtt) {
          dataSource = dataSources[dataSourceKey];
        }
      }
    } else if (dataSourceRef !== undefined) {
      if (!dataSourceRef.startsWith('referencetotransformerrootstackGraphQLAPINONEDS')) {
        for (const outputKey in outputs) {
          if (dataSourceRef.endsWith(outputKey)) {
            dataSource = dataSources[outputs[outputKey]];
            break;
          }
        }
      }
    }

    return new AppsyncFunction(
        context, functionName,
        {
          name: functionName,
          api,
          dataSource: dataSources[NONE_DS],
          requestMappingTemplate: MappingTemplate.fromFile(
            path.join(
              this.props.outDir,
              reqFile,
            )
          ),
          responseMappingTemplate,
        }
      );
  }

  generateResolver(
    context: Construct,
    api: GraphqlApi,
    resource: any,
    //functions: Record<string, AppsyncFunction>,
    tableName: string,
    fieldName: string,
    typeName: string
  )
  {
    const functions: AppsyncFunction[] = [];

    //console.log(`--> ${typeName} - ${fieldName}`);
    const pipelineFunctions = resource.Properties.PipelineConfig.Functions;
    pipelineFunctions.forEach((fn: any) => {
      //console.log(fn);
      let fnLongName: string;
      const fnGetAtt = fn['Fn::GetAtt'];
      if (fnGetAtt !== undefined) {
        fnLongName = fnGetAtt[0];
        //console.log(`GET ATT = ${fnLongName}`);
      } else {
        //let fnRef = fn['Ref'];
        fnLongName = fn['Ref'];
        //console.log(`REF => ${fnRef}`);
      }
      for (const fnKey in this.functions) {
        const fnKey2 = `${fnKey}${fnKey}`;
        if (fnLongName.indexOf(fnKey2) !== -1) {
          //console.log(`FOUND: ${fnKey}`);
          functions.push(this.functions[fnKey]);
          //this.generateHookFunction(fnKey);
          break;
        }
      }
      //init0Function
      //preAuth0Function
      //auth0Function
      //postAuth0Function
      //DataResolverFn
    });
    let dataSourceType = "NONE";
    if (typeName === "MUTATION" || typeName === "SUBSCRIPTION") {
      dataSourceType = "AMAZON_DYNAMODB";
    }

     new Resolver(context, `${typeName}${fieldName}Resolver`, {
      api,
      typeName,
      fieldName,
      requestMappingTemplate: MappingTemplate.fromString(`
        $util.qr($ctx.stash.put("typeName", "${typeName}"))
        $util.qr($ctx.stash.put("fieldName", "${fieldName}"))
        $util.qr($ctx.stash.put("conditions", []))
        $util.qr($ctx.stash.put("metadata", {}))
        $util.qr($ctx.stash.metadata.put("dataSourceType", "${dataSourceType}"))
        $util.qr($ctx.stash.put("tableName", "${tableName}"))
        $util.toJson({})
      `),
      pipelineConfig: functions,
      responseMappingTemplate: MappingTemplate.fromString(
        "$util.toJson($ctx.prev.result)"
      ),
    });
  }

  generateHookFunction(fn: string) {
    if (fn.indexOf('init0Function') !== -1) {
      console.log(`Init`);
    } else if (fn.indexOf('preAuth0Function') !== -1) {
      console.log(`Pre Auth`);
    } else if (fn.indexOf('auth0Function') !== -1) {
      console.log(`Auth`);
    } else if (fn.indexOf('postAuth0Function') !== -1) {
      console.log(`Post Auth`);
    } else if (fn.indexOf('DataResolverFn') !== -1) {
      console.log(`Data Resolver`);
    } else {
      console.log(`RESOLVER NOT FOUND!!!`);
    }
  }

  generateResolverOld(
    context: Construct,
    api: GraphqlApi,
    dataSources: Record<string, BaseDataSource>,
    stackKey: string,
    fieldName: string,
    typeName: string
  ): Resolver {
    let auth = false;
    let dataSourceType = "NONE";
    const functions: AppsyncFunction[] = [];
    // TODO: add preauth JS Resolver. e.g., Query.getTodo.preAuth.js
    if (TYPE_NAMES.indexOf(typeName) !== -1) {
        auth = true;
        // TODO AUTH
        if (typeName === "Subscription") {
          if (this.subcriptionAuthFunctions[stackKey] === undefined) {
            const authFn = this.generateAuthFunction(context, api, fieldName, typeName, dataSources[NONE_DS]);
            if (authFn !== undefined) {
              this.subcriptionAuthFunctions[stackKey] = authFn;
              functions.push(this.subcriptionAuthFunctions[stackKey]);
            }
          } else {
            functions.push(this.subcriptionAuthFunctions[stackKey]);
          }
        } else {
          const authFn = this.generateAuthFunction(context, api, fieldName, typeName, dataSources[NONE_DS]);
          if (authFn !== undefined) {
            functions.push(authFn);
          }
        }

        // TODO: post auth VTL

      if (typeName === "MUTATION" || typeName === "SUBSCRIPTION") {
        dataSourceType = "AMAZON_DYNAMODB";
      }
    }
    // TODO: add postauth JS Resolver. e.g., Query.getTodo.postAuth.1.XXX.js
    

    let dataResolverDataSource: BaseDataSource = dataSources[NONE_DS];

    // TODO: DataResolverFunction - done-ish, but it should be editable and using JS Resolver instead. e.g., Query.getTodo.dataResolver.req.js
    let dataResolverFn: AppsyncFunction | undefined;
    dataResolverFn = this.generateDataResolverFunction(
      context,
      api,
      dataResolverDataSource,
      fieldName,
      typeName
    )
    if (dataResolverFn !== undefined) {
      functions.push(dataResolverFn);
    }

    // TODO: add postauth JS Resolver. e.g., Query.getTodo.postDataResolver.js

    const resolver = new Resolver(context, `${typeName}${fieldName}Resolver`, {
      api,
      typeName,
      fieldName,
      requestMappingTemplate: MappingTemplate.fromString(`
        $util.qr($ctx.stash.put("typeName", "${typeName}"))
        $util.qr($ctx.stash.put("fieldName", "${fieldName}"))
        $util.qr($ctx.stash.put("conditions", []))
        $util.qr($ctx.stash.put("metadata", {}))
        $util.qr($ctx.stash.metadata.put("dataSourceType", "${dataSourceType}"))
        $util.qr($ctx.stash.put("tableName", "${stackKey}"))
        $util.toJson({})
      `),
      pipelineConfig: functions,
      responseMappingTemplate: MappingTemplate.fromString(
        "$util.toJson($ctx.prev.result)"
      ),
    });

    // TODO: Field resolver
    return resolver;
  }

  generateDataResolverFunction(
    context: Construct,
    api: GraphqlApi,
    dataSource: BaseDataSource,
    fieldName: string,
    typeName: string
  ): AppsyncFunction | undefined {
    let fn: AppsyncFunction;

    if (fs.existsSync(path.join(this.props.outDir, `${typeName}.${fieldName}.req.vtl`))) {
      fn = new AppsyncFunction(
        context,
        `${typeName}${fieldName}DataResolverfunction`,
        {
          name: `${typeName}_${fieldName}_data_resolver_function`,
          api,
          dataSource,
          requestMappingTemplate: MappingTemplate.fromFile(
            path.join(this.props.outDir, `${typeName}.${fieldName}.req.vtl`)
          ),
          responseMappingTemplate: MappingTemplate.fromFile(
            path.join(this.props.outDir, `${typeName}.${fieldName}.res.vtl`)
          ),
        }
      );
    }

    return fn!;
  }

  generateAuthFunction(
    context: Construct,
    api: GraphqlApi,
    fieldName: string,
    typeName: string,
    dataSource: BaseDataSource,
  ): AppsyncFunction | undefined {
    let fn: AppsyncFunction;

    if (fs.existsSync(path.join(this.props.outDir, `${typeName}.${fieldName}.auth.1.req.vtl`))) {
      fn = new AppsyncFunction(
        context,
        `${typeName}${fieldName}AuthFunction`,
        {
          name: `${typeName}_${fieldName}_auth1_function`,
          api,
          dataSource,
          requestMappingTemplate: MappingTemplate.fromFile(
            path.join(
              this.props.outDir,
              `${typeName}.${fieldName}.auth.1.req.vtl`
            )
          ),
          responseMappingTemplate: MappingTemplate.fromString("$util.toJson()"),
        }
      );
    }

    return fn!;
  }

  generateDisableSandboxFunction(
    context: Construct,
    api: GraphqlApi,
    fieldName: string,
    typeName: string,
    dataSource: BaseDataSource,
  ): AppsyncFunction {
    const fn = new AppsyncFunction(
      context,
      `${typeName}${fieldName}DisableSandboxFunction`,
      {
        name: `${typeName}_${fieldName}disable_sandbox_function`,
        api,
        dataSource,
        requestMappingTemplate: MappingTemplate.fromFile(
          path.join(
            this.props.outDir,
            `${typeName}.${fieldName}.postAuth.1.req.vtl`
          )
        ),
        responseMappingTemplate: MappingTemplate.fromString("$util.toJson()"),
      }
    );

    return fn;
  }

  createTable(context: Construct, tableName: string, resource: any): Table {
    // TODO: parse resource
    const dummyTable = new Table(context, `${tableName}Table`, {
      tableName,
      partitionKey: { name: "id", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    return dummyTable;
  }

  createDataSource(
    tableName: string,
    api: GraphqlApi,
    tables: Record<string, Table>
  ) {
    return api.addDynamoDbDataSource(
      `${tableName}DataSource`,
      tables[tableName]
    );
  }

  createCognitoUserPool(): IUserPool {
    const cognito = new UserPool(this, "dummy_userpool", {
      userPoolName: "dummy_userpool",
      signInAliases: { username: true, email: true },
      signInCaseSensitive: false,
      mfa: Mfa.OFF,
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      selfSignUpEnabled: false,
      keepOriginal: { email: true },
      userInvitation: {
        emailSubject: "Invite to join our awesome app!",
        emailBody:
          "Hello {username}, you have been invited to join our awesome app! Your temporary password is {####}",
        smsMessage:
          "Hello {username}, your temporary password for our awesome app is {####}",
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const cognitoRole = new Role(this, "dummy_auth_role", {
      assumedBy: new ServicePrincipal("cognito-idp.amazonaws.com"),
    });
    cognito.grant(cognitoRole, "cognito-idp:AdminCreateUser");
    cognito.addClient("dummy-client", {
      userPoolClientName: "dummy-client",
      authFlows: {
        userSrp: true,
        userPassword: true,
      },
      authSessionValidity: Duration.minutes(3),
      refreshTokenValidity: Duration.days(30),
      accessTokenValidity: Duration.minutes(60),
      idTokenValidity: Duration.minutes(60),
    });

    return cognito;
  }

  saveSchema(out: DeploymentResources) {
    fs.writeFileSync(
      path.join(this.props.outDir, "graphql.schema"),
      out.schema,
      {
        flag: "w",
      }
    );
  }

  saveVtls(out: DeploymentResources) {
    for (const key in out.resolvers) {
      const pathToFile = path.join(this.props.outDir, key);
      //console.log("Writing: " + pathToFile);
      fs.writeFileSync(pathToFile, out.resolvers[key], {
        flag: "w",
      });
    }
  }

  prepareOutputDir() {
    if (fs.existsSync(this.props.outDir)) {
      const stats = fs.statSync(this.props.outDir);
      if (stats.isDirectory()) {
        fs.emptyDirSync(this.props.outDir);
      } else {
        fs.rmSync(this.props.outDir);
      }
    }
    fs.mkdirSync(this.props.outDir, { recursive: true });
  }

  getSchema(): string {
    const schemaFilePath = path.normalize(
      path.join(this.props.schemaDir, this.props.schemaSingleFileName)
    );
    const schemaDirectoryPath = path.normalize(
      path.join(this.props.schemaDir, this.props.schemaMultiDirName)
    );

    let fullSchema: string = "";
    if (fs.existsSync(schemaFilePath)) {
      const stats = fs.statSync(schemaFilePath);
      if (stats.isFile()) {
        fullSchema = fs.readFileSync(schemaFilePath, "utf8");
      }
    } else if (fs.existsSync(schemaDirectoryPath)) {
      const stats = fs.statSync(schemaDirectoryPath);
      if (stats.isDirectory()) {
        const fileContentsList: string[] = [];
        fs.readdirSync(schemaDirectoryPath).forEach((fileName) => {
          fileContentsList.push(
            fs.readFileSync(path.join(schemaDirectoryPath, fileName), "utf8")
          );
        });
        fullSchema = fileContentsList.join("\n");
      }
    }

    return fullSchema;
  }

  getAuthConfig(): AppSyncAuthConfiguration {
    const authConfig: AppSyncAuthConfiguration = {
      defaultAuthentication: {
        authenticationType: "AMAZON_COGNITO_USER_POOLS",
      },
      additionalAuthenticationProviders: [
        {
          authenticationType: "API_KEY",
          apiKeyConfig: {
            apiKeyExpirationDays: 365,
          },
        },
      ],
    };

    return authConfig;
  }

  getFeatureFlags(): FeatureFlagProvider {
    const featureFlags: FeatureFlagProvider = {
      getBoolean(_: string, defaultValue: boolean | undefined) {
        if (defaultValue !== undefined) {
          return defaultValue;
        } else {
          return true;
        }
      },
      getNumber: (_: string, defaultValue: number | undefined): number => {
        if (defaultValue !== undefined) {
          return defaultValue;
        } else {
          return 0;
        }
      },
      getObject: (_: string, defaultValue: object | undefined): object => {
        if (defaultValue !== undefined) {
          return defaultValue;
        } else {
          return {};
        }
      },
    };

    return featureFlags;
  }

  getTransformer(
    authConfig: AppSyncAuthConfiguration,
    featureFlags: FeatureFlagProvider
  ): GraphQLTransform {
    const authTransformer = new AuthTransformer();
    const modelTransformer = new ModelTransformer();
    const indexTransformer = new IndexTransformer();
    const hasOneTransformer = new HasOneTransformer();

    const transformer = new GraphQLTransform({
      authConfig,
      transformers: [
        modelTransformer,
        new PrimaryKeyTransformer(),
        indexTransformer,
        hasOneTransformer,
        new HasManyTransformer(),
        new BelongsToTransformer(),
        new DefaultValueTransformer(),
        new ManyToManyTransformer(
          modelTransformer,
          indexTransformer,
          hasOneTransformer,
          authTransformer
        ),
        authTransformer,
        new FunctionTransformer(),
      ],
      filepaths: {
        getBackendDirPath: () => "",
        findProjectRoot: () => "",
        getCurrentCloudBackendDirPath: () => "",
      },
      resolverConfig: {
        project: {
          ConflictDetection: 'VERSION',
          ConflictHandler: ConflictHandlerType.AUTOMERGE,
        },
      },
      featureFlags,
    });

    return transformer;
  }

  capitalizeFirstLetter(str: string): string {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  }
}
