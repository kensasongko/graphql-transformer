#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SchemaTransformerStack } from "../lib/schema-transformer-stack";

const app = new cdk.App();
new SchemaTransformerStack(app, "SchemaTransformerStack", {
  apiName: "Test",
  jsResolverDir: "./lib/resolvers/",
  schemaDir: "./lib/schema",
  outDir: "./lib/graphql/",
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
