import { AuthTransformer } from "@aws-amplify/graphql-auth-transformer";
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
import { GraphQLTransform } from "@aws-amplify/graphql-transformer-core";
import {
  AppSyncAuthConfiguration,
  FeatureFlagProvider,
} from "@aws-amplify/graphql-transformer-interfaces";
import path from "path";
import * as fs from "fs-extra";
import { FunctionTransformer } from "@aws-amplify/graphql-function-transformer";
import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DeploymentResources } from "@aws-amplify/graphql-transformer-interfaces/src";
import { AppsyncFunction, AuthorizationType, DynamoDbDataSource, GraphqlApi, MappingTemplate, Resolver, SchemaFile, UserPoolDefaultAction } from "aws-cdk-lib/aws-appsync";
import { AccountRecovery, IUserPool, Mfa, UserPool } from "aws-cdk-lib/aws-cognito";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";

export interface SchemaTransformerStackProps extends StackProps {
  schemaDir: string;
  schemaSingleFileName: string;
  schemaMultiDirName: string;
  outDir: string;
  userPool?: IUserPool;
}

const StackPropsDefaults: SchemaTransformerStackProps = {
  schemaDir: "./graphql",
  schemaSingleFileName: "graphql.schema",
  schemaMultiDirName: "schema",
  outDir: "./output",
}

export class SchemaTransformerStack extends Stack {
  public props:SchemaTransformerStackProps;
  public TYPE_NAMES = ['Subscription', 'Mutation', 'Query'];
  public transformer: GraphQLTransform;
  public stacks: Record<string, Stack>;
  public api: GraphqlApi;
  public dataSources: Record<string, DynamoDbDataSource>;
  public tables: Record<string, Table>;
  public functions: Record<string, AppsyncFunction>;
  public resolvers: Record<string, Resolver>;

  constructor(scope: Construct, id: string, props: SchemaTransformerStackProps){
    super(scope, id, props);
    this.props = {...props, ...StackPropsDefaults};
    if (this.props.userPool === undefined) {
      this.props.userPool = this.createCognitoUserPool();
    }

    const authConfig = this.getAuthConfig();
    const featureFlags = this.getFeatureFlags();
    this.transformer = this.getTransformer(authConfig, featureFlags);
    const fullSchema = this.getSchema();
    const out = this.transformer.transform(fullSchema);
    this.saveSchema(out);

    this.api = new GraphqlApi(this, 'test_api', {
      name: 'TestApi',
      schema: SchemaFile.fromAsset(path.join(this.props.outDir, 'schema/schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: this.props.userPool,
            defaultAction: UserPoolDefaultAction.ALLOW
          }
        }
      }
    });

    this.stacks = {};
    this.dataSources = {};
    this.tables = {};
    this.functions = {};
    this.resolvers = {};

    for (const stackKey in out.stacks) {
      const stack = out.stacks[stackKey]
      this.stacks[stackKey] = new Stack(this, `${stackKey}Stack`, this.props);
      for (const resourceKey in stack.Resources) {
        const resource = stack.Resources[resourceKey];
        switch(resource.Type) {
          case "AWS::AppSync::Table":
            this.tables[stackKey] = this.createTable(this, stackKey, resource);
            break;
          case "AWS::AppSync::DataSource":
            this.dataSources[stackKey] = this.createDataSource(stackKey, this.api, this.tables);
            break;
          case "AWS::AppSync::Resolver":
            const fieldName = resource.Properties.FieldName;
            const typeName = resource.Properties.TypeName;
            this.resolvers[`${typeName}${fieldName}`] = this.generateResolver(
              this.stacks[stackKey],
              this.api,
              this.dataSources[stackKey],
              stackKey,
              fieldName,
              typeName)
            ;
            break;
        }
      }
    }
  }

  generateResolver(context: Construct, api: GraphqlApi, dataSource: DynamoDbDataSource, tableName: string, fieldName: string, typeName: string): Resolver {
    let auth = false;
    let dataSourceType = "NONE";
    const functions: AppsyncFunction[] = [];
    if (this.TYPE_NAMES.indexOf(typeName) !== -1) {
      auth = true;
      // TODO AUTH
      functions.push(this.generateAuthFunction(context, api, fieldName, typeName));
      if (typeName === "MUTATION" || typeName === "SUBSCRIPTION"){
        dataSourceType = "AMAZON_DYNAMODB";
      }
    }
    // TODO: Subscriptions use the very same auth VTL

    // TODO: DataResolverFunction - done-ish, but it should be editable and using JS Resolver instead.
    functions.push(this.generateDataResolverFunction(context, api, dataSource, fieldName, typeName));

    const resolver = new Resolver(context, `${typeName}${fieldName}Resolver`, {
      api,
      typeName: '${typeName}',
      fieldName: '${fieldName}',
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
      responseMappingTemplate: MappingTemplate.fromString('$util.toJson($ctx.prev.result)')
    });

    // TODO: Field resolver
    return resolver;
  }

  generateDataResolverFunction(context: Construct, api: GraphqlApi, dataSource: DynamoDbDataSource, fieldName: string, typeName: string): AppsyncFunction {
    const fn = new AppsyncFunction(context, `${typeName}${fieldName}DataResolverfunction`, {
      name: `${typeName}_${fieldName}_data_resolver_function`,
      api,
      dataSource,
      requestMappingTemplate: MappingTemplate.fromFile(path.join(this.props.outDir, `${typeName}.${fieldName}.req.vtl`)),
      responseMappingTemplate: MappingTemplate.fromFile(path.join(this.props.outDir, `${typeName}.${fieldName}.res.vtl`)),
    });

    return fn;
  }

  generateAuthFunction(context: Construct, api: GraphqlApi, fieldName: string, typeName: string): AppsyncFunction {
    const fn = new AppsyncFunction(context, `${typeName}${fieldName}Authfunction`, {
      name: `${typeName}_${fieldName}_auth1_function`,
      api,
      dataSource: api.addNoneDataSource('none'),
      requestMappingTemplate: MappingTemplate.fromFile(path.join(this.props.outDir, `${typeName}.${fieldName}.auth.1.req.vtl`)),
      responseMappingTemplate: MappingTemplate.fromString('$util.toJson()')
    });

    return fn;
  }

  createTable(context: Construct, tableName: string, resource: any): Table {
    // TODO: parse resource
    const dummyTable = new Table(context, `${tableName}Table`, {
      tableName,
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY
    });

    return dummyTable;
  }

  createDataSource(tableName: string, api: GraphqlApi, tables: Record<string, Table>) {
    return api.addDynamoDbDataSource(`${tableName}DataSource`, tables[tableName]);
  }

  createCognitoUserPool(): IUserPool {
    const cognito = new UserPool(this, 'dummy_userpool', {
      userPoolName: 'dummy_userpool',
      signInAliases: { username: true, email: true },
      signInCaseSensitive: false,
      mfa: Mfa.OFF,
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      selfSignUpEnabled: false,
      keepOriginal: { email: true },
      userInvitation: {
        emailSubject: 'Invite to join our awesome app!',
        emailBody: 'Hello {username}, you have been invited to join our awesome app! Your temporary password is {####}',
        smsMessage: 'Hello {username}, your temporary password for our awesome app is {####}',
      },
      removalPolicy: RemovalPolicy.DESTROY
    })
    const cognitoRole = new Role(this, 'todo_auth_role',{
      assumedBy: new ServicePrincipal('cognito-idp.amazonaws.com')
    })
    cognito.grant(cognitoRole, 'cognito-idp:AdminCreateUser');
    cognito.addClient('todo-client', {
      userPoolClientName: 'todo-client',
      authFlows: {
        userSrp: true,
        userPassword: true
      },
      authSessionValidity: Duration.minutes(3),
      refreshTokenValidity: Duration.days(30),
      accessTokenValidity: Duration.minutes(60),
      idTokenValidity: Duration.minutes(60),
    })

    return cognito;
  }

  saveSchema(out: DeploymentResources) {
    fs.writeFileSync(path.join(this.props.outDir, "graphql.schema"), out.schema, {
      flag: "w",
    });
  }

  saveVtls(out: DeploymentResources) {
    for (const key in out.resolvers) {
      const pathToFile = path.join(this.props.outDir, key);
      console.log("Writing: " + pathToFile);
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
    fs.mkdirSync(path.join(this.props.outDir, 'vtls'), { recursive: true });

  }

  getSchema(): string {
    const schemaFilePath = path.normalize(path.join(this.props.schemaDir, this.props.schemaSingleFileName));
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

  getAuthConfig(): AppSyncAuthConfiguration{
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
      getNumber: (
        _: string,
        defaultValue: number | undefined
      ): number => {
        if (defaultValue !== undefined) {
          return defaultValue;
        } else {
          return 0;
        }
      },
      getObject: (
        _: string,
        defaultValue: object | undefined
      ): object => {
        if (defaultValue !== undefined) {
          return defaultValue;
        } else {
          return {};
        }
      },
    };

    return featureFlags;
  }

  getTransformer(authConfig: AppSyncAuthConfiguration, featureFlags: FeatureFlagProvider): GraphQLTransform {
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
      featureFlags,
    });

    return transformer;
  }
}
