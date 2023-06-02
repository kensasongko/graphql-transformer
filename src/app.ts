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

const SCHEMA_PATH = "./graphql/";
const OUTPUT_PATH = "./output/";

const SCHEMA_FILE_NAME = "graphql.schema";
const SCHEMA_DIRECTORY_NAME = "schema";

const TYPE_NAMES = ['Subscription', 'Mutation', 'Query'];

const generateResolver = (tableName: string, fieldName: string, typeName: string): string => {
  let output:string[] = [];
  let auth = false;
  let dataSource = "NONE";
  if (TYPE_NAMES.indexOf(typeName) !== -1) {
    auth = true;
    output.push(generateAuthFunction(fieldName, typeName));
    if (typeName === "MUTATION"){
      dataSource = "AMAZON_DYNAMODB";
    }

  }

  output.push(`
  const ${typeName}_${fieldName}Resolver = new appsync.Resolver(this, 'pipeline', {
    api,
    dataSource: api.addNoneDataSource('none'),
    typeName: '${typeName}',
    fieldName: '${fieldName}',
    requestMappingTemplate: appsync.MappingTemplate.fromString(\`
      $util.qr($ctx.stash.put("typeName", "${typeName}"))
      $util.qr($ctx.stash.put("fieldName", "${fieldName}"))
      $util.qr($ctx.stash.put("conditions", []))
      $util.qr($ctx.stash.put("metadata", {}))
      $util.qr($ctx.stash.metadata.put("dataSourceType", "${dataSource}"))
      $util.qr($ctx.stash.put("tableName", "${tableName}"))
      $util.toJson({})
  \`)
    pipelineConfig: [${typeName}_${fieldName}AuthFunction],
    responseMappingTemplate: appsync.MappingTemplate.fromString('$util.toJson($ctx.prev.result)')
  });`);

  // TODO: Field resolver
  return output.join("\n");
}

const generateAuthFunction = (fieldName: string, typeName: string): string => {
  return `
  const ${typeName}_${fieldName}AuthFunction = new appsync.AppsyncFunction(this, 'function', {
    name: '${typeName}_${fieldName}_auth1_function',
    api,
    dataSource: api.addNoneDataSource('none'),
    requestMappingTemplate: appsync.MappingTemplate.fromFile('output/vtls/${typeName}.${fieldName}.auth.1.req'),
    responseMappingTemplate: appsync.MappingTemplate.fromString('$util.toJson()')
  });`;
}

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

const schemaFilePath = path.normalize(path.join(SCHEMA_PATH, SCHEMA_FILE_NAME));
const schemaDirectoryPath = path.normalize(
  path.join(SCHEMA_PATH, SCHEMA_DIRECTORY_NAME)
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


const out = transformer.transform(fullSchema);


if (fs.existsSync(OUTPUT_PATH)) {
  const stats = fs.statSync(schemaDirectoryPath);
  if (stats.isDirectory()) {
    fs.emptyDirSync(OUTPUT_PATH);
  } else {
    fs.rmSync(OUTPUT_PATH);
  }
}
fs.mkdirSync(path.join(OUTPUT_PATH, 'vtls'), { recursive: true });
fs.mkdirSync(path.join(OUTPUT_PATH, 'constructs'), { recursive: true });

console.log("Writing: " + path.join(OUTPUT_PATH, "graphql.schema"));
fs.writeFileSync(path.join(OUTPUT_PATH, "graphql.schema"), out.schema, {
  flag: "w",
});

for (const key in out.resolvers) {
  const pathToFile = path.join(OUTPUT_PATH, `vtls/${key}`);
  console.log("Writing: " + pathToFile);
  fs.writeFileSync(pathToFile, out.resolvers[key], {
    flag: "w",
  });
}

for (const key in out.stacks) {
  console.log("Writing: " + path.join(OUTPUT_PATH, key));
  let output: string[] = [];
  const stack = out.stacks[key]
  for (const key2 in stack.Resources) {
    if (stack.Resources[key2].Type === "AWS::AppSync::Resolver") {
      //console.log(stack.Resources[key2]);
      const resource = stack.Resources[key2];

      const fieldName = resource.Properties.FieldName;
      const typeName = resource.Properties.TypeName;
      output.push(generateResolver(key, fieldName, typeName));
    }
  }
  const pathToFile = path.join(OUTPUT_PATH, `constructs/${key}.ts`);
  fs.writeFileSync(pathToFile, output.join("\n"), {
    flag: "w",
  });
}
