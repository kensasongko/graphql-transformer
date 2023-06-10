/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreatePostMetadataInput = {
  postMetadataReference: string,
  title: string,
  _version?: number | null,
  postMetadataPostPostReference?: string | null,
};

export type ModelPostMetadataConditionInput = {
  title?: ModelStringInput | null,
  and?: Array< ModelPostMetadataConditionInput | null > | null,
  or?: Array< ModelPostMetadataConditionInput | null > | null,
  not?: ModelPostMetadataConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  postMetadataPostPostReference?: ModelIDInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type PostMetadata = {
  __typename: "PostMetadata",
  postMetadataReference: string,
  title: string,
  post?: Post | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  postMetadataPostPostReference?: string | null,
  owner?: string | null,
};

export type Post = {
  __typename: "Post",
  postReference: string,
  title: string,
  comments?: ModelCommentConnection | null,
  metadata?: PostMetadata | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  postMetadataPostMetadataReference?: string | null,
  owner?: string | null,
};

export type ModelCommentConnection = {
  __typename: "ModelCommentConnection",
  items:  Array<Comment | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type Comment = {
  __typename: "Comment",
  commentReference: string,
  title: string,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  postCommentsPostReference?: string | null,
  owner?: string | null,
};

export type UpdatePostMetadataInput = {
  postMetadataReference: string,
  title?: string | null,
  _version?: number | null,
  postMetadataPostPostReference?: string | null,
};

export type DeletePostMetadataInput = {
  postMetadataReference: string,
  _version?: number | null,
};

export type CreatePostInput = {
  postReference: string,
  title: string,
  _version?: number | null,
  postMetadataPostMetadataReference?: string | null,
};

export type ModelPostConditionInput = {
  title?: ModelStringInput | null,
  and?: Array< ModelPostConditionInput | null > | null,
  or?: Array< ModelPostConditionInput | null > | null,
  not?: ModelPostConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  postMetadataPostMetadataReference?: ModelIDInput | null,
};

export type UpdatePostInput = {
  postReference: string,
  title?: string | null,
  _version?: number | null,
  postMetadataPostMetadataReference?: string | null,
};

export type DeletePostInput = {
  postReference: string,
  _version?: number | null,
};

export type CreateCommentInput = {
  commentReference: string,
  title: string,
  _version?: number | null,
  postCommentsPostReference?: string | null,
};

export type ModelCommentConditionInput = {
  title?: ModelStringInput | null,
  and?: Array< ModelCommentConditionInput | null > | null,
  or?: Array< ModelCommentConditionInput | null > | null,
  not?: ModelCommentConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  postCommentsPostReference?: ModelIDInput | null,
};

export type UpdateCommentInput = {
  commentReference: string,
  title?: string | null,
  _version?: number | null,
  postCommentsPostReference?: string | null,
};

export type DeleteCommentInput = {
  commentReference: string,
  _version?: number | null,
};

export type CreateFooInput = {
  id?: string | null,
  _version?: number | null,
};

export type ModelFooConditionInput = {
  and?: Array< ModelFooConditionInput | null > | null,
  or?: Array< ModelFooConditionInput | null > | null,
  not?: ModelFooConditionInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type Foo = {
  __typename: "Foo",
  id: string,
  bars?: ModelFooBarConnection | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  owner?: string | null,
};

export type ModelFooBarConnection = {
  __typename: "ModelFooBarConnection",
  items:  Array<FooBar | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type FooBar = {
  __typename: "FooBar",
  id: string,
  fooId: string,
  barId: string,
  foo: Foo,
  bar: Bar,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  owner?: string | null,
};

export type Bar = {
  __typename: "Bar",
  id: string,
  foos?: ModelFooBarConnection | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  owner?: string | null,
};

export type UpdateFooInput = {
  id: string,
  _version?: number | null,
};

export type DeleteFooInput = {
  id: string,
  _version?: number | null,
};

export type CreateBarInput = {
  id?: string | null,
  _version?: number | null,
};

export type ModelBarConditionInput = {
  and?: Array< ModelBarConditionInput | null > | null,
  or?: Array< ModelBarConditionInput | null > | null,
  not?: ModelBarConditionInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type UpdateBarInput = {
  id: string,
  _version?: number | null,
};

export type DeleteBarInput = {
  id: string,
  _version?: number | null,
};

export type CreateFooBarInput = {
  id?: string | null,
  fooId: string,
  barId: string,
  _version?: number | null,
};

export type ModelFooBarConditionInput = {
  fooId?: ModelIDInput | null,
  barId?: ModelIDInput | null,
  and?: Array< ModelFooBarConditionInput | null > | null,
  or?: Array< ModelFooBarConditionInput | null > | null,
  not?: ModelFooBarConditionInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type UpdateFooBarInput = {
  id: string,
  fooId?: string | null,
  barId?: string | null,
  _version?: number | null,
};

export type DeleteFooBarInput = {
  id: string,
  _version?: number | null,
};

export type ModelPostMetadataFilterInput = {
  postMetadataReference?: ModelIDInput | null,
  title?: ModelStringInput | null,
  and?: Array< ModelPostMetadataFilterInput | null > | null,
  or?: Array< ModelPostMetadataFilterInput | null > | null,
  not?: ModelPostMetadataFilterInput | null,
  _deleted?: ModelBooleanInput | null,
  postMetadataPostPostReference?: ModelIDInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelPostMetadataConnection = {
  __typename: "ModelPostMetadataConnection",
  items:  Array<PostMetadata | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelPostFilterInput = {
  postReference?: ModelIDInput | null,
  title?: ModelStringInput | null,
  and?: Array< ModelPostFilterInput | null > | null,
  or?: Array< ModelPostFilterInput | null > | null,
  not?: ModelPostFilterInput | null,
  _deleted?: ModelBooleanInput | null,
  postMetadataPostMetadataReference?: ModelIDInput | null,
};

export type ModelPostConnection = {
  __typename: "ModelPostConnection",
  items:  Array<Post | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelCommentFilterInput = {
  commentReference?: ModelIDInput | null,
  title?: ModelStringInput | null,
  and?: Array< ModelCommentFilterInput | null > | null,
  or?: Array< ModelCommentFilterInput | null > | null,
  not?: ModelCommentFilterInput | null,
  _deleted?: ModelBooleanInput | null,
  postCommentsPostReference?: ModelIDInput | null,
};

export type ModelFooFilterInput = {
  id?: ModelIDInput | null,
  and?: Array< ModelFooFilterInput | null > | null,
  or?: Array< ModelFooFilterInput | null > | null,
  not?: ModelFooFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelFooConnection = {
  __typename: "ModelFooConnection",
  items:  Array<Foo | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelBarFilterInput = {
  id?: ModelIDInput | null,
  and?: Array< ModelBarFilterInput | null > | null,
  or?: Array< ModelBarFilterInput | null > | null,
  not?: ModelBarFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelBarConnection = {
  __typename: "ModelBarConnection",
  items:  Array<Bar | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelFooBarFilterInput = {
  id?: ModelIDInput | null,
  fooId?: ModelIDInput | null,
  barId?: ModelIDInput | null,
  and?: Array< ModelFooBarFilterInput | null > | null,
  or?: Array< ModelFooBarFilterInput | null > | null,
  not?: ModelFooBarFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionPostMetadataFilterInput = {
  postMetadataReference?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPostMetadataFilterInput | null > | null,
  or?: Array< ModelSubscriptionPostMetadataFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionPostFilterInput = {
  postReference?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPostFilterInput | null > | null,
  or?: Array< ModelSubscriptionPostFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionCommentFilterInput = {
  commentReference?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionCommentFilterInput | null > | null,
  or?: Array< ModelSubscriptionCommentFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionFooFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionFooFilterInput | null > | null,
  or?: Array< ModelSubscriptionFooFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionBarFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionBarFilterInput | null > | null,
  or?: Array< ModelSubscriptionBarFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionFooBarFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  fooId?: ModelSubscriptionIDInput | null,
  barId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionFooBarFilterInput | null > | null,
  or?: Array< ModelSubscriptionFooBarFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type CreatePostMetadataMutationVariables = {
  input: CreatePostMetadataInput,
  condition?: ModelPostMetadataConditionInput | null,
};

export type CreatePostMetadataMutation = {
  createPostMetadata?:  {
    __typename: "PostMetadata",
    postMetadataReference: string,
    title: string,
    post?:  {
      __typename: "Post",
      postReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostMetadataReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdatePostMetadataMutationVariables = {
  input: UpdatePostMetadataInput,
  condition?: ModelPostMetadataConditionInput | null,
};

export type UpdatePostMetadataMutation = {
  updatePostMetadata?:  {
    __typename: "PostMetadata",
    postMetadataReference: string,
    title: string,
    post?:  {
      __typename: "Post",
      postReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostMetadataReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type DeletePostMetadataMutationVariables = {
  input: DeletePostMetadataInput,
  condition?: ModelPostMetadataConditionInput | null,
};

export type DeletePostMetadataMutation = {
  deletePostMetadata?:  {
    __typename: "PostMetadata",
    postMetadataReference: string,
    title: string,
    post?:  {
      __typename: "Post",
      postReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostMetadataReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type CreatePostMutationVariables = {
  input: CreatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type CreatePostMutation = {
  createPost?:  {
    __typename: "Post",
    postReference: string,
    title: string,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    metadata?:  {
      __typename: "PostMetadata",
      postMetadataReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostPostReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostMetadataReference?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdatePostMutationVariables = {
  input: UpdatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type UpdatePostMutation = {
  updatePost?:  {
    __typename: "Post",
    postReference: string,
    title: string,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    metadata?:  {
      __typename: "PostMetadata",
      postMetadataReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostPostReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostMetadataReference?: string | null,
    owner?: string | null,
  } | null,
};

export type DeletePostMutationVariables = {
  input: DeletePostInput,
  condition?: ModelPostConditionInput | null,
};

export type DeletePostMutation = {
  deletePost?:  {
    __typename: "Post",
    postReference: string,
    title: string,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    metadata?:  {
      __typename: "PostMetadata",
      postMetadataReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostPostReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostMetadataReference?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateCommentMutationVariables = {
  input: CreateCommentInput,
  condition?: ModelCommentConditionInput | null,
};

export type CreateCommentMutation = {
  createComment?:  {
    __typename: "Comment",
    commentReference: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateCommentMutationVariables = {
  input: UpdateCommentInput,
  condition?: ModelCommentConditionInput | null,
};

export type UpdateCommentMutation = {
  updateComment?:  {
    __typename: "Comment",
    commentReference: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteCommentMutationVariables = {
  input: DeleteCommentInput,
  condition?: ModelCommentConditionInput | null,
};

export type DeleteCommentMutation = {
  deleteComment?:  {
    __typename: "Comment",
    commentReference: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateFooMutationVariables = {
  input: CreateFooInput,
  condition?: ModelFooConditionInput | null,
};

export type CreateFooMutation = {
  createFoo?:  {
    __typename: "Foo",
    id: string,
    bars?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type UpdateFooMutationVariables = {
  input: UpdateFooInput,
  condition?: ModelFooConditionInput | null,
};

export type UpdateFooMutation = {
  updateFoo?:  {
    __typename: "Foo",
    id: string,
    bars?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type DeleteFooMutationVariables = {
  input: DeleteFooInput,
  condition?: ModelFooConditionInput | null,
};

export type DeleteFooMutation = {
  deleteFoo?:  {
    __typename: "Foo",
    id: string,
    bars?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type CreateBarMutationVariables = {
  input: CreateBarInput,
  condition?: ModelBarConditionInput | null,
};

export type CreateBarMutation = {
  createBar?:  {
    __typename: "Bar",
    id: string,
    foos?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type UpdateBarMutationVariables = {
  input: UpdateBarInput,
  condition?: ModelBarConditionInput | null,
};

export type UpdateBarMutation = {
  updateBar?:  {
    __typename: "Bar",
    id: string,
    foos?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type DeleteBarMutationVariables = {
  input: DeleteBarInput,
  condition?: ModelBarConditionInput | null,
};

export type DeleteBarMutation = {
  deleteBar?:  {
    __typename: "Bar",
    id: string,
    foos?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type CreateFooBarMutationVariables = {
  input: CreateFooBarInput,
  condition?: ModelFooBarConditionInput | null,
};

export type CreateFooBarMutation = {
  createFooBar?:  {
    __typename: "FooBar",
    id: string,
    fooId: string,
    barId: string,
    foo:  {
      __typename: "Foo",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    bar:  {
      __typename: "Bar",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type UpdateFooBarMutationVariables = {
  input: UpdateFooBarInput,
  condition?: ModelFooBarConditionInput | null,
};

export type UpdateFooBarMutation = {
  updateFooBar?:  {
    __typename: "FooBar",
    id: string,
    fooId: string,
    barId: string,
    foo:  {
      __typename: "Foo",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    bar:  {
      __typename: "Bar",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type DeleteFooBarMutationVariables = {
  input: DeleteFooBarInput,
  condition?: ModelFooBarConditionInput | null,
};

export type DeleteFooBarMutation = {
  deleteFooBar?:  {
    __typename: "FooBar",
    id: string,
    fooId: string,
    barId: string,
    foo:  {
      __typename: "Foo",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    bar:  {
      __typename: "Bar",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type GetPostMetadataQueryVariables = {
  postMetadataReference: string,
};

export type GetPostMetadataQuery = {
  getPostMetadata?:  {
    __typename: "PostMetadata",
    postMetadataReference: string,
    title: string,
    post?:  {
      __typename: "Post",
      postReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostMetadataReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type ListPostMetadataQueryVariables = {
  postMetadataReference?: string | null,
  filter?: ModelPostMetadataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListPostMetadataQuery = {
  listPostMetadata?:  {
    __typename: "ModelPostMetadataConnection",
    items:  Array< {
      __typename: "PostMetadata",
      postMetadataReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostPostReference?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncPostMetadataQueryVariables = {
  filter?: ModelPostMetadataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncPostMetadataQuery = {
  syncPostMetadata?:  {
    __typename: "ModelPostMetadataConnection",
    items:  Array< {
      __typename: "PostMetadata",
      postMetadataReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostPostReference?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetPostQueryVariables = {
  postReference: string,
};

export type GetPostQuery = {
  getPost?:  {
    __typename: "Post",
    postReference: string,
    title: string,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    metadata?:  {
      __typename: "PostMetadata",
      postMetadataReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostPostReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostMetadataReference?: string | null,
    owner?: string | null,
  } | null,
};

export type ListPostsQueryVariables = {
  postReference?: string | null,
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListPostsQuery = {
  listPosts?:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      postReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostMetadataReference?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncPostsQueryVariables = {
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncPostsQuery = {
  syncPosts?:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      postReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostMetadataReference?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetCommentQueryVariables = {
  commentReference: string,
};

export type GetCommentQuery = {
  getComment?:  {
    __typename: "Comment",
    commentReference: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type ListCommentsQueryVariables = {
  commentReference?: string | null,
  filter?: ModelCommentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListCommentsQuery = {
  listComments?:  {
    __typename: "ModelCommentConnection",
    items:  Array< {
      __typename: "Comment",
      commentReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postCommentsPostReference?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncCommentsQueryVariables = {
  filter?: ModelCommentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncCommentsQuery = {
  syncComments?:  {
    __typename: "ModelCommentConnection",
    items:  Array< {
      __typename: "Comment",
      commentReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postCommentsPostReference?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetFooQueryVariables = {
  id: string,
};

export type GetFooQuery = {
  getFoo?:  {
    __typename: "Foo",
    id: string,
    bars?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type ListFoosQueryVariables = {
  filter?: ModelFooFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFoosQuery = {
  listFoos?:  {
    __typename: "ModelFooConnection",
    items:  Array< {
      __typename: "Foo",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncFoosQueryVariables = {
  filter?: ModelFooFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncFoosQuery = {
  syncFoos?:  {
    __typename: "ModelFooConnection",
    items:  Array< {
      __typename: "Foo",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetBarQueryVariables = {
  id: string,
};

export type GetBarQuery = {
  getBar?:  {
    __typename: "Bar",
    id: string,
    foos?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type ListBarsQueryVariables = {
  filter?: ModelBarFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBarsQuery = {
  listBars?:  {
    __typename: "ModelBarConnection",
    items:  Array< {
      __typename: "Bar",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncBarsQueryVariables = {
  filter?: ModelBarFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncBarsQuery = {
  syncBars?:  {
    __typename: "ModelBarConnection",
    items:  Array< {
      __typename: "Bar",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetFooBarQueryVariables = {
  id: string,
};

export type GetFooBarQuery = {
  getFooBar?:  {
    __typename: "FooBar",
    id: string,
    fooId: string,
    barId: string,
    foo:  {
      __typename: "Foo",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    bar:  {
      __typename: "Bar",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type ListFooBarsQueryVariables = {
  filter?: ModelFooBarFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFooBarsQuery = {
  listFooBars?:  {
    __typename: "ModelFooBarConnection",
    items:  Array< {
      __typename: "FooBar",
      id: string,
      fooId: string,
      barId: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncFooBarsQueryVariables = {
  filter?: ModelFooBarFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncFooBarsQuery = {
  syncFooBars?:  {
    __typename: "ModelFooBarConnection",
    items:  Array< {
      __typename: "FooBar",
      id: string,
      fooId: string,
      barId: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type OnCreatePostMetadataSubscriptionVariables = {
  filter?: ModelSubscriptionPostMetadataFilterInput | null,
  owner?: string | null,
};

export type OnCreatePostMetadataSubscription = {
  onCreatePostMetadata?:  {
    __typename: "PostMetadata",
    postMetadataReference: string,
    title: string,
    post?:  {
      __typename: "Post",
      postReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostMetadataReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdatePostMetadataSubscriptionVariables = {
  filter?: ModelSubscriptionPostMetadataFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePostMetadataSubscription = {
  onUpdatePostMetadata?:  {
    __typename: "PostMetadata",
    postMetadataReference: string,
    title: string,
    post?:  {
      __typename: "Post",
      postReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostMetadataReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeletePostMetadataSubscriptionVariables = {
  filter?: ModelSubscriptionPostMetadataFilterInput | null,
  owner?: string | null,
};

export type OnDeletePostMetadataSubscription = {
  onDeletePostMetadata?:  {
    __typename: "PostMetadata",
    postMetadataReference: string,
    title: string,
    post?:  {
      __typename: "Post",
      postReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostMetadataReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreatePostSubscriptionVariables = {
  filter?: ModelSubscriptionPostFilterInput | null,
  owner?: string | null,
};

export type OnCreatePostSubscription = {
  onCreatePost?:  {
    __typename: "Post",
    postReference: string,
    title: string,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    metadata?:  {
      __typename: "PostMetadata",
      postMetadataReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostPostReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostMetadataReference?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdatePostSubscriptionVariables = {
  filter?: ModelSubscriptionPostFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePostSubscription = {
  onUpdatePost?:  {
    __typename: "Post",
    postReference: string,
    title: string,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    metadata?:  {
      __typename: "PostMetadata",
      postMetadataReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostPostReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostMetadataReference?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeletePostSubscriptionVariables = {
  filter?: ModelSubscriptionPostFilterInput | null,
  owner?: string | null,
};

export type OnDeletePostSubscription = {
  onDeletePost?:  {
    __typename: "Post",
    postReference: string,
    title: string,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    metadata?:  {
      __typename: "PostMetadata",
      postMetadataReference: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postMetadataPostPostReference?: string | null,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postMetadataPostMetadataReference?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateCommentSubscriptionVariables = {
  filter?: ModelSubscriptionCommentFilterInput | null,
  owner?: string | null,
};

export type OnCreateCommentSubscription = {
  onCreateComment?:  {
    __typename: "Comment",
    commentReference: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateCommentSubscriptionVariables = {
  filter?: ModelSubscriptionCommentFilterInput | null,
  owner?: string | null,
};

export type OnUpdateCommentSubscription = {
  onUpdateComment?:  {
    __typename: "Comment",
    commentReference: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteCommentSubscriptionVariables = {
  filter?: ModelSubscriptionCommentFilterInput | null,
  owner?: string | null,
};

export type OnDeleteCommentSubscription = {
  onDeleteComment?:  {
    __typename: "Comment",
    commentReference: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsPostReference?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateFooSubscriptionVariables = {
  filter?: ModelSubscriptionFooFilterInput | null,
  owner?: string | null,
};

export type OnCreateFooSubscription = {
  onCreateFoo?:  {
    __typename: "Foo",
    id: string,
    bars?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type OnUpdateFooSubscriptionVariables = {
  filter?: ModelSubscriptionFooFilterInput | null,
  owner?: string | null,
};

export type OnUpdateFooSubscription = {
  onUpdateFoo?:  {
    __typename: "Foo",
    id: string,
    bars?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type OnDeleteFooSubscriptionVariables = {
  filter?: ModelSubscriptionFooFilterInput | null,
  owner?: string | null,
};

export type OnDeleteFooSubscription = {
  onDeleteFoo?:  {
    __typename: "Foo",
    id: string,
    bars?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type OnCreateBarSubscriptionVariables = {
  filter?: ModelSubscriptionBarFilterInput | null,
  owner?: string | null,
};

export type OnCreateBarSubscription = {
  onCreateBar?:  {
    __typename: "Bar",
    id: string,
    foos?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type OnUpdateBarSubscriptionVariables = {
  filter?: ModelSubscriptionBarFilterInput | null,
  owner?: string | null,
};

export type OnUpdateBarSubscription = {
  onUpdateBar?:  {
    __typename: "Bar",
    id: string,
    foos?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type OnDeleteBarSubscriptionVariables = {
  filter?: ModelSubscriptionBarFilterInput | null,
  owner?: string | null,
};

export type OnDeleteBarSubscription = {
  onDeleteBar?:  {
    __typename: "Bar",
    id: string,
    foos?:  {
      __typename: "ModelFooBarConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type OnCreateFooBarSubscriptionVariables = {
  filter?: ModelSubscriptionFooBarFilterInput | null,
  owner?: string | null,
};

export type OnCreateFooBarSubscription = {
  onCreateFooBar?:  {
    __typename: "FooBar",
    id: string,
    fooId: string,
    barId: string,
    foo:  {
      __typename: "Foo",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    bar:  {
      __typename: "Bar",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type OnUpdateFooBarSubscriptionVariables = {
  filter?: ModelSubscriptionFooBarFilterInput | null,
  owner?: string | null,
};

export type OnUpdateFooBarSubscription = {
  onUpdateFooBar?:  {
    __typename: "FooBar",
    id: string,
    fooId: string,
    barId: string,
    foo:  {
      __typename: "Foo",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    bar:  {
      __typename: "Bar",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};

export type OnDeleteFooBarSubscriptionVariables = {
  filter?: ModelSubscriptionFooBarFilterInput | null,
  owner?: string | null,
};

export type OnDeleteFooBarSubscription = {
  onDeleteFooBar?:  {
    __typename: "FooBar",
    id: string,
    fooId: string,
    barId: string,
    foo:  {
      __typename: "Foo",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    bar:  {
      __typename: "Bar",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    owner?: string | null,
  } | null,
};
