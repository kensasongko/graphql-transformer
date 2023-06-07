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
  public stacks: Record<string, Stack>;
  public api: GraphqlApi;

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
    const transformer = this.getTransformer(authConfig, featureFlags);
    const fullSchema = this.getSchema();
    const deployment = transformer.transform(fullSchema);
    this.saveSchema(deployment);
    this.saveVtls(deployment);
    console.log(deployment.stackMapping);

    this.stacks = {};
    let dataSourceList: Record<string, BaseDataSource> = {};
    let tableList: Record<string, Table> = {};
    let functionList: Record<string, AppsyncFunction> = {};
    //let resolverList: Record<string, Resolver> = {};
    let dataSourceOutputs: Record<string, string> = {};
    let functionOutputs: Record<string, string> = {};

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
    dataSourceList[NONE_DS] = this.api.addNoneDataSource("none");

    for (const stackKey in deployment.stacks) {
      const stack = deployment.stacks[stackKey];
      this.stacks[stackKey] = new Stack(this, `${stackKey}Stack`, this.props);
      for (const resourceKey in stack.Resources) {
        const resource = stack.Resources[resourceKey];
        //console.log(`${stackKey} - ${resource.Type}`);
        switch (resource.Type) {
          case "AWS::DynamoDB::Table":
            tableList[stackKey] = this.createTable(this, stackKey, resource);
            break;
          case "AWS::AppSync::DataSource":
            //console.log(`${stackKey}DataSource`);
            dataSourceList[`${stackKey}DataSource`] = this.createDataSource(
              stackKey,
              tableList
            );
            break;
          case "AWS::AppSync::FunctionConfiguration":
            const functionName = resource.Properties.Name;
            //console.log(functionName);
            //console.log(resource.Properties.DataSourceName);
            functionList[functionName] = this.generateFunction(
              this.stacks[stackKey],
              resource,
              dataSourceOutputs,
              functionName,
              dataSourceList,
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
              resource,
              functionList,
              stackKey,
              fieldName,
              typeName
            );
            break;
        }
      }

      const outputs = stack.Outputs;
      if (outputs !== undefined) {
        const allOutputs = this.parseOutputs(outputs, functionList);
        dataSourceOutputs = allOutputs.dataSourceOutputs;
        functionOutputs = allOutputs.functionOutputs;
      }

      //console.log(stack);
    }
    //console.log(this.functionOutputs);
  }
  
  parseOutputs(outputs: Record<string, any>, functionList: Record<string, AppsyncFunction>): {dataSourceOutputs: Record<string, string>, functionOutputs: Record<string, string>} {
    const dataSourceOutputs: Record<string, string> = {};
    const functionOutputs: Record<string, string> = {};


    for (const outputKey in outputs) {
      if (outputKey.startsWith('transformerrootstack')) {
        if (outputKey.endsWith('FunctionId') === false) {
          const getAtt = outputs[outputKey].Value['Fn::GetAtt'];
          if (getAtt !== undefined) {
            dataSourceOutputs[outputKey] = getAtt[0];
          }
        } else {
          //console.log(outputKey);
          const getAtt = outputs[outputKey].Value['Fn::GetAtt'][0];
          for (const functionKey in functionList) {
            if (getAtt.startsWith(functionKey)) {
              functionOutputs[outputKey] = functionKey;
              break;
            }
          }
        }
      }
    }

    return {dataSourceOutputs, functionOutputs};
  }

  generateFunction(context: Construct, resource: any, outputs: Record<string, string>, functionName: string, dataSources: Record<string, BaseDataSource>) {
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
          api: this.api,
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
    resource: any,
    functionList: Record<string, AppsyncFunction>,
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
      for (const fnKey in functionList) {
        const fnKey2 = `${fnKey}${fnKey}`;
        if (fnLongName.indexOf(fnKey2) !== -1) {
          //console.log(`FOUND: ${fnKey}`);
          functions.push(functionList[fnKey]);
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
      api: this.api,
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
    tables: Record<string, Table>
  ) {
    return this.api.addDynamoDbDataSource(
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
