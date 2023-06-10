import {
  AuthTransformer,
  NONE_DS,
} from "@aws-amplify/graphql-auth-transformer";
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
import {
  ConflictHandlerType,
  GraphQLTransform,
} from "@aws-amplify/graphql-transformer-core";
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
  Code,
  FunctionRuntime,
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
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { glob } from "glob";

const DATA_SOURCE_STACK = "DataSourceStack";
const FUNCTION_STACK_SUFFIX = "Function";

export interface SchemaTransformerStackProps extends StackProps {
  apiName: string;
  jsResolverDir: string;
  schemaDir: string;
  outDir: string;
  userPool?: IUserPool;
}

export class SchemaTransformerStack extends Stack {
  public readonly api: GraphqlApi;
  public readonly stackList: Record<string, Stack>;
  public readonly dataSourceList: Record<string, BaseDataSource>;
  public readonly tableList: Record<string, Table>;
  public readonly functionList: Record<string, AppsyncFunction>;
  public readonly resolverList: Record<string, Resolver>;
  private readonly apiName: string;
  private readonly jsResolverDir: string;
  private readonly outDir: string;
  private readonly schemaDir: string;
  private readonly schemaSingleFileName: string;
  private readonly schemaMultiDirName: string;
  private readonly userPool: IUserPool;

  constructor(
    scope: Construct,
    id: string,
    props: SchemaTransformerStackProps
  ) {
    super(scope, id, props);

    this.apiName = props.apiName;
    this.jsResolverDir = props.jsResolverDir;
    this.outDir = props.outDir;
    this.schemaDir = props.schemaDir;

    if (props.userPool !== undefined) {
      this.userPool = props.userPool;
    } else {
      this.userPool = this.createCognitoUserPool();
    }

    this.prepareOutputDir();
    const authConfig = this.getAuthConfig();
    const featureFlags = this.getFeatureFlags();
    const transformer = this.getTransformer(authConfig, featureFlags);
    const fullSchema = this.getSchema();
    const deployment = transformer.transform(fullSchema);
    this.saveSchema(deployment);

    this.api = new GraphqlApi(this, `${this.apiName}Api`, {
      name: `${this.apiName}Api`,
      schema: SchemaFile.fromAsset(path.join(this.outDir, "schema.graphql")),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: this.userPool,
            defaultAction: UserPoolDefaultAction.ALLOW,
          },
        },
      },
    });

    this.stackList = {};
    this.stackList[DATA_SOURCE_STACK] = new Stack(
      this,
      DATA_SOURCE_STACK,
      props
    );
    this.createStack(deployment, props);
    this.tableList = {};
    this.generateTables(deployment);
    this.dataSourceList = {};
    this.generateDataSources(deployment);
    this.dataSourceList[NONE_DS] = this.api.addNoneDataSource("none");
    const dataSourceOutputs = this.parseOutputs(deployment);
    this.functionList = {};
    this.generateFunctions(deployment, dataSourceOutputs, deployment.resolvers);
    this.resolverList = {};
    this.generateResolver(deployment);
  }

  protected parseOutputs(
    deployment: DeploymentResources
  ): Record<string, string> {
    const dataSourceOutputs: Record<string, string> = {};

    for (const stackKey in deployment.stacks) {
      const stack = deployment.stacks[stackKey];
      const outputs = stack.Outputs;

      for (const outputKey in outputs) {
        if (outputKey.startsWith("transformerrootstack")) {
          if (outputKey.endsWith("FunctionId") === false) {
            const getAtt = outputs[outputKey].Value["Fn::GetAtt"];
            if (getAtt !== undefined) {
              dataSourceOutputs[outputKey] = getAtt[0];
            }
          }
        }
      }
    }

    return dataSourceOutputs;
  }

  protected createStack(deployment: DeploymentResources, props: StackProps) {
    for (const stackKey in deployment.stacks) {
      this.stackList[`${stackKey}${FUNCTION_STACK_SUFFIX}`] = new Stack(
        this,
        `${stackKey}${FUNCTION_STACK_SUFFIX}Stack`,
        props
      );
    }
  }

  protected generateFunctions(
    deployment: DeploymentResources,
    outputs: Record<string, string>,
    resolverFunctions: Record<string, string>
  ) {
    for (const stackKey in deployment.stacks) {
      const stack = deployment.stacks[stackKey];
      //console.log(`STACK: ${stackKey}Stack`);
      for (const resourceKey in stack.Resources) {
        const resource = stack.Resources[resourceKey];
        if (resource.Type === "AWS::AppSync::FunctionConfiguration") {
          const properties = resource.Properties;
          const functionName = properties.Name;
          //console.log(functionName);
          const reqFile =
            properties.RequestMappingTemplateS3Location["Fn::Join"][1][4].split(
              "/"
            )[2];

          let responseMappingTemplate: MappingTemplate;
          const resString = properties.ResponseMappingTemplate;
          if (resString !== undefined) {
            responseMappingTemplate = MappingTemplate.fromString(resString);
          } else {
            const resolverFunctionKey =
              properties.ResponseMappingTemplateS3Location[
                "Fn::Join"
              ][1][4].split("/")[2];
            responseMappingTemplate = MappingTemplate.fromString(
              resolverFunctions[resolverFunctionKey]
            );
          }

          let dataSource: BaseDataSource = this.dataSourceList[NONE_DS];
          const dataSourceAtt = properties.DataSourceName["Fn::GetAtt"];
          const dataSourceRef = properties.DataSourceName.Ref;
          if (dataSourceAtt !== undefined) {
            //console.log(`Data source: ${dataSourceAtt[0]}`);
            for (const dataSourceKey in this.dataSourceList) {
              if (dataSourceKey === dataSourceAtt[0]) {
                dataSource = this.dataSourceList[dataSourceKey];
              }
            }
          } else if (dataSourceRef !== undefined) {
            //console.log(`Data source: ${dataSourceRef}`);
            if (
              !dataSourceRef.startsWith(
                "referencetotransformerrootstackGraphQLAPINONEDS"
              )
            ) {
              for (const outputKey in outputs) {
                if (dataSourceRef.endsWith(outputKey)) {
                  dataSource = this.dataSourceList[outputs[outputKey]];
                  break;
                }
              }
            }
          }
          //console.log(`Data Source Name: ${dataSource.name}`);

          this.functionList[functionName] = new AppsyncFunction(
            this.stackList[`${stackKey}${FUNCTION_STACK_SUFFIX}`],
            functionName,
            {
              name: functionName,
              api: this.api,
              dataSource,
              requestMappingTemplate: MappingTemplate.fromString(
                resolverFunctions[reqFile]
              ),
              responseMappingTemplate,
            }
          );
        }
      }
    }
  }

  protected generateResolver(deployment: DeploymentResources) {
    for (const stackKey in deployment.stacks) {
      const stack = deployment.stacks[stackKey];
      for (const resourceKey in stack.Resources) {
        const resource = stack.Resources[resourceKey];
        if (resource.Type === "AWS::AppSync::Resolver") {
          let functions: AppsyncFunction[] = [];
          const fieldName = resource.Properties.FieldName;
          const typeName = resource.Properties.TypeName;
          const pipelineFunctions =
            resource.Properties.PipelineConfig.Functions;
          pipelineFunctions.forEach((fn: any) => {
            let fnLongName: string;
            const fnGetAtt = fn["Fn::GetAtt"];
            if (fnGetAtt !== undefined) {
              fnLongName = fnGetAtt[0];
            } else {
              fnLongName = fn["Ref"];
            }
            for (const fnKey in this.functionList) {
              const doubleFnKey = `${fnKey}${fnKey}`;
              if (fnLongName.indexOf(doubleFnKey) !== -1) {
                functions = [
                  ...functions,
                  ...this.getPipelineFunctions(fieldName, typeName, fnKey),
                ];
                break;
              }
            }
          });

          let dataSourceType = "NONE";
          if (typeName === "MUTATION" || typeName === "SUBSCRIPTION") {
            dataSourceType = "AMAZON_DYNAMODB";
          }

          this.resolverList[`${typeName}${fieldName}`] = new Resolver(
            this.stackList[`${stackKey}${FUNCTION_STACK_SUFFIX}`],
            `${typeName}${fieldName}Resolver`,
            {
              api: this.api,
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
            }
          );
        }
      }
    }
  }

  protected getPipelineFunctions(
    fieldName: string,
    typeName: string,
    fnKey: string
  ): AppsyncFunction[] {
    const fns: AppsyncFunction[] = [];
    let pipelineStep: string;

    // e.g., For Query.getPost
    if (fnKey.indexOf("init0Function") !== -1) {
      //console.log(`Init`);
      pipelineStep = "init";
    } else if (fnKey.indexOf("preAuth0Function") !== -1) {
      //console.log(`Pre Auth`);
      pipelineStep = "preAuth";
    } else if (fnKey.indexOf("auth0Function") !== -1) {
      //console.log(`Auth`);
      pipelineStep = "auth";
      // Post/Query.getPost.auth.pre.1.PostDataSource.js
      // Post/Query.getPost.auth.pre.2.CommentDataSource.js
      // Post/Query.getPost.auth.pre.3.CommentDataSource.js
      // Post/Query.getPost.auth.post.1.PostDataSource.js
    } else if (fnKey.indexOf("postAuth0Function") !== -1) {
      // console.log(`Post Auth`);
      pipelineStep = "postAuth";
    } else if (fnKey.indexOf("DataResolverFn") !== -1) {
      // console.log(`Data Resolver`);
      pipelineStep = "data";
      // Post/Query.getPost.data.override.1.PostDataSource.js
      // Post/Query.getPost.data.override.2.PostDataSource.js
    } else {
      console.log(`RESOLVER NOT FOUND!!!`);
      throw new Error("Resolver's function not found");
    }

    const jsResolverPreFiles = this.globHookFunction(
      fieldName,
      typeName,
      pipelineStep,
      "pre"
    );
    const jsResolverOverrideFiles = this.globHookFunction(
      fieldName,
      typeName,
      pipelineStep,
      "override"
    );
    const jsResolverPostFiles = this.globHookFunction(
      fieldName,
      typeName,
      pipelineStep,
      "post"
    );

    if (jsResolverPreFiles.length !== 0) {
      jsResolverPreFiles.forEach((preFile) => {
        fns.push(this.getJsResolverFunction(preFile));
      });
    }

    if (jsResolverOverrideFiles.length !== 0) {
      jsResolverOverrideFiles.forEach((overrideFile) => {
        fns.push(this.getJsResolverFunction(overrideFile));
      });
    } else {
      fns.push(this.functionList[fnKey]); //VTL
    }

    if (jsResolverPostFiles.length !== 0) {
      jsResolverPostFiles.forEach((postFile) => {
        fns.push(this.getJsResolverFunction(postFile));
      });
    }

    return fns;
  }

  protected getJsResolverFunction(
    resolverFunctionFile: string
  ): AppsyncFunction {
    //console.log(resolverFunctionFile);
    const fileParts = path.parse(resolverFunctionFile).base.split(".");
    const typeName = fileParts[0];
    const fieldName = fileParts[1];
    const pipelineStep = fileParts[2];
    const hookStep = fileParts[3];
    const num = fileParts[4];
    const dataSourceName = fileParts[5];
    const functionName = `${typeName}_${fieldName}_${pipelineStep}_${hookStep}_${num}_function`;
    //console.log(dataSourceName);
    return new AppsyncFunction(this, functionName, {
      name: functionName,
      api: this.api,
      dataSource: this.dataSourceList[dataSourceName],
      code: Code.fromAsset(resolverFunctionFile),
      runtime: FunctionRuntime.JS_1_0_0,
    });
  }

  protected globHookFunction(
    fieldName: string,
    typeName: string,
    pipelineStep: string,
    hookStep: string
  ): string[] {
    let files = glob
      .sync(`**/${typeName}.${fieldName}.${pipelineStep}.${hookStep}.*.js`, {
        cwd: this.jsResolverDir,
      })
      .map((fileName) => path.join(this.jsResolverDir, fileName));
    if (files.length !== 0) {
      files = files.sort((n1, n2) => {
        if (n1 > n2) {
          return 1;
        }

        if (n1 < n2) {
          return -1;
        }

        return 0;
      });
    }

    return files;
  }

  protected generateTables(deployment: DeploymentResources) {
    for (const stackKey in deployment.stacks) {
      const stack = deployment.stacks[stackKey];
      for (const resourceKey in stack.Resources) {
        const resource = stack.Resources[resourceKey];
        if (resource.Type === "AWS::DynamoDB::Table") {
          const keySchemas: any[] = resource.Properties.KeySchema;
          const attrDef: any[] = resource.Properties.AttributeDefinitions;

          let partitionKey: string;
          partitionKey = keySchemas.find(
            (el) => el.KeyType === "HASH"
          )?.AttributeName;

          let sortKey: string;
          sortKey = keySchemas.find(
            (el) => el.KeyType === "RANGE"
          )?.AttributeName;

          let partitionType;
          partitionType = attrDef.find(
            (el) => el.AttributeName === partitionKey
          )?.AttributeType;

          let sortType;
          sortType = attrDef.find(
            (el) => el.AttributeName === sortKey
          )?.AttributeType;

          this.tableList[stackKey] = new Table(
            this.stackList[DATA_SOURCE_STACK],
            `${stackKey}Table`,
            {
              tableName: stackKey,
              partitionKey: { name: partitionKey, type: partitionType },
              sortKey: sortKey ? { name: sortKey, type: sortType } : undefined,
              removalPolicy: RemovalPolicy.DESTROY,
              billingMode: BillingMode.PAY_PER_REQUEST,
            }
          );

          if (resource.Properties.GlobalSecondaryIndexes) {
            const arrayGSI = Array.from(
              resource.Properties.GlobalSecondaryIndexes
            );
            if (arrayGSI.length > 0) {
              arrayGSI.forEach((gsi: any) => {
                const gsiName = gsi.IndexName;
                const gsiKeySchemas = gsi.KeySchema;
                let gsiPartition: string;
                let gsiSort: string;
                gsiPartition = gsiKeySchemas.find(
                  (el: any) => el.KeyType === "HASH"
                )?.AttributeName;
                gsiSort = gsiKeySchemas.find(
                  (el: any) => el.KeyType === "RANGE"
                )?.AttributeName;
                this.tableList[stackKey].addGlobalSecondaryIndex({
                  indexName: gsiName,
                  // fixed type due to lack of info on out.json
                  partitionKey: {
                    name: gsiPartition,
                    type: AttributeType.STRING,
                  },
                  sortKey: gsiSort
                    ? { name: gsiSort, type: AttributeType.STRING }
                    : undefined,
                  projectionType:
                    gsi.Projection?.ProjectionType || ProjectionType.ALL,
                });
              });
            }
          }
        }
      }
    }
  }

  protected generateDataSources(deployment: DeploymentResources) {
    for (const stackKey in deployment.stacks) {
      const stack = deployment.stacks[stackKey];
      for (const resourceKey in stack.Resources) {
        const resource = stack.Resources[resourceKey];
        if (resource.Type === "AWS::AppSync::DataSource") {
          this.dataSourceList[`${stackKey}DataSource`] =
            this.api.addDynamoDbDataSource(
              `${stackKey}DataSource`,
              this.tableList[stackKey]
            );
        }
      }
    }
  }

  protected createCognitoUserPool(): IUserPool {
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

  protected saveSchema(out: DeploymentResources) {
    fs.writeFileSync(path.join(this.outDir, "schema.graphql"), out.schema, {
      flag: "w",
    });
  }

  protected prepareOutputDir() {
    if (!fs.existsSync(this.outDir)) {
      fs.mkdirSync(this.outDir, { recursive: true });
    }
  }

  protected getSchema(): string {
    let fullSchema: string = "";
    if (fs.existsSync(this.schemaDir)) {
      const stats = fs.statSync(this.schemaDir);
      if (stats.isDirectory()) {
        const fileContentsList: string[] = [];
        fs.readdirSync(this.schemaDir).forEach((fileName) => {
          fileContentsList.push(
            fs.readFileSync(path.join(this.schemaDir, fileName), "utf8")
          );
        });
        fullSchema = fileContentsList.join("\n");
      }
    }

    return fullSchema;
  }

  protected getAuthConfig(): AppSyncAuthConfiguration {
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

  protected getFeatureFlags(): FeatureFlagProvider {
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

  protected getTransformer(
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
          ConflictDetection: "VERSION",
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
