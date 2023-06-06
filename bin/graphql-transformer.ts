#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SchemaTransformerStack } from '../lib/schema-transformer-stack';

const app = new cdk.App();
new SchemaTransformerStack(app, 'SchemaTransformerStack', {
  schemaDir: "./lib/graphql",
  schemaSingleFileName: "graphql.schema",
  schemaMultiDirName: "schema",
  outDir: "./output",
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
