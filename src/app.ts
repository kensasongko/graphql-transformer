import { AuthTransformer } from "@aws-amplify/graphql-auth-transformer";
import { DefaultValueTransformer } from "@aws-amplify/graphql-default-value-transformer";
import { PrimaryKeyTransformer } from "@aws-amplify/graphql-index-transformer";
import { ModelTransformer } from "@aws-amplify/graphql-model-transformer";
import { BelongsToTransformer, HasManyTransformer, HasOneTransformer } from "@aws-amplify/graphql-relational-transformer";
import { GraphQLTransform } from "@aws-amplify/graphql-transformer-core";
import { AppSyncAuthConfiguration, FeatureFlagProvider } from "@aws-amplify/graphql-transformer-interfaces";
import path from "path";
import * as fs from 'fs';
import * as glob from 'glob';

const SCHEMA_PATH = './graphql/';
const OUTPUT_PATH = './output/';

const SCHEMA_FILE_NAME = 'graphql.schema';
const SCHEMA_DIRECTORY_NAME = 'schema';

const featureFlags: FeatureFlagProvider = {
  getBoolean: (value: string): boolean => {
    if (value === 'respectPrimaryKeyAttributesOnConnectionField') {
      return true;
    }
    return false;
  },
  getNumber: (featureName: string, defaultValue: number | undefined): number => {
    if (defaultValue !== undefined) {
      return defaultValue;
    } else {
      return 0;
    }
  },
  getObject: (featureName: string, defaultValue: object | undefined): object => {
    if (defaultValue !== undefined) {
      return defaultValue;
    } else {
      return {};
    }
  },
}

const authConfig: AppSyncAuthConfiguration = {
  defaultAuthentication: {
    authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  },
  additionalAuthenticationProviders: [],
};

const transformer = new GraphQLTransform({
  authConfig,
  transformers: [
    new ModelTransformer(),
    new PrimaryKeyTransformer(),
    new HasOneTransformer(),
    new HasManyTransformer(),
    new BelongsToTransformer(),
    new AuthTransformer(),
    new DefaultValueTransformer(),
  ],
  featureFlags,
});

const schemaFilePath = path.normalize(path.join(SCHEMA_PATH, SCHEMA_FILE_NAME));
const schemaDirectoryPath = path.normalize(path.join(SCHEMA_PATH, SCHEMA_DIRECTORY_NAME));

let fullSchema = '';
if (fs.existsSync(schemaFilePath)) {
  const stats = fs.statSync(schemaFilePath);
  if (stats.isFile()) {
    fullSchema = fs.readFileSync(schemaFilePath, 'utf8');
  }
} else if (fs.existsSync(schemaDirectoryPath)) {
  const stats = fs.statSync(schemaDirectoryPath);
  if (stats.isDirectory()) {
    const fileContentsList: string[] = [];
    fs.readdirSync(schemaDirectoryPath).forEach((fileName) => {
      fileContentsList.push(fs.readFileSync(path.join(schemaDirectoryPath, fileName), 'utf8'));
    });
    fullSchema = fileContentsList.join('\n');
  }
}

const out = transformer.transform(fullSchema);

console.log("=========== BEGIN SCHEMA ===========");
fs.writeFileSync(path.join(OUTPUT_PATH, 'graphql.schema'), out.schema, {
  flag: 'w',
});
console.log("=========== END SCHEMA ===========");

console.log("=========== BEGIN RESOLVERS ===========");
for (const key in out.resolvers) {
  console.log(key);
  fs.writeFileSync(path.join(OUTPUT_PATH, key), out.resolvers[key], {
    flag: 'w',
  });
}
console.log("=========== END RESOLVERS ===========");