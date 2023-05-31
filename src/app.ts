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

const PATH = './graphql/';

const SCHEMA_FILE = 'graphql.schema';
const SCHEMA_DIRECTORY = 'schema';

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

const schemaFilePath = path.join(PATH, SCHEMA_FILE);
const schemaDirectoryPath = path.join(PATH, SCHEMA_DIRECTORY);
const schemaFileExists = fs.existsSync(schemaFilePath);
const schemaDirectoryExists = fs.existsSync(schemaDirectoryPath);

let schema = '';
if (schemaFileExists) {
  schema = fs.readFileSync(schemaFilePath, 'utf8');
} else if (schemaDirectoryExists) {
  const schemaFiles = glob
    .sync('**/*.graphql', { cwd: schemaDirectoryPath })
    .map((fileName) => path.join(schemaDirectoryPath, fileName));
  schema = schemaFiles.join('\n');
}

const out = transformer.transform(schema);

console.log("=========== BEGIN SCHEMA ===========");
console.log(out.schema);
console.log("=========== END SCHEMA ===========");

console.log("=========== BEGIN RESOLVERS ===========");
for (const key in out.resolvers) {
  console.log(key);
}
console.log("=========== END RESOLVERS ===========");
