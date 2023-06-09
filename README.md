# CDK Amplify Graphql Transformer

This project shows how to generate configureable CDK stack from Amplify transformers.

- Place your `graphql.schema` in `lib/schema/` (or `foo.schema` and `bar.schema` if you have more than one).
- Run `cdk deploy --all --require-approval never --concurrency 10`

## Amplify codegen

Run `yarn codegen` to generate typings, mutation, query and subscription files.

## Custom JS Resolver Function

- You can add custom JS resolver function to the Pipeline Resolver. The format is as follows:
`/path/to/custom/function/[TableName]/[TypeName].[FieldName].[PipelineStep].[HookStep].[HookOrder].[DataSourceName].js`
where:
- `TableName` is the name of the DynamoDB table (e.g., Post, Comment)
- `TypeName` is the GraphQL type (e.g., Query, Mutation)
- `FieldName` is GraphQL field (e.g., getPost, updatePost)
- `PipelineStep` is amplify VTL step. Allowed values: init, preAuth, auth, postAuth, data
- `HookStep` is where to add the hook. Allowed values: pre, post, override (override will override the VTL function)
- `HookOrder` is the insert order of the hook (e.g., 1, 2, 3)
- `DataSourceName` is the name of the data source (e.g., PostDataSource, CommentDataSource)

## TODO
- Data sync table

### Example of function file name:
- `lib/resolvers/Post/Query.getPost.auth.pre.1.PostDataSource.js`
- `lib/resolvers/Post/Query.getPost.auth.pre.2.CommentDataSource.js`
- `lib/resolvers/Post/Query.getPost.auth.pre.3.PostMetadataDataSource.js`
- `lib/resolvers/Post/Query.getPost.auth.post.1.PostDataSource.js`
- `lib/resolvers/Post/Query.getPost.data.override.1.PostDataSource.js`


## Useful commands

- `yarn build` compile typescript to js
- `yarn watch` watch for changes and compile
- `yarn test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
- `cdk list` list stacks
