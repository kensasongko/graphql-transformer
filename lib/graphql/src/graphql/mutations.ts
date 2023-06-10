/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPostMetadata = /* GraphQL */ `
  mutation CreatePostMetadata(
    $input: CreatePostMetadataInput!
    $condition: ModelPostMetadataConditionInput
  ) {
    createPostMetadata(input: $input, condition: $condition) {
      postMetadataReference
      title
      post {
        postReference
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        postMetadataPostMetadataReference
        owner
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      postMetadataPostPostReference
      owner
    }
  }
`;
export const updatePostMetadata = /* GraphQL */ `
  mutation UpdatePostMetadata(
    $input: UpdatePostMetadataInput!
    $condition: ModelPostMetadataConditionInput
  ) {
    updatePostMetadata(input: $input, condition: $condition) {
      postMetadataReference
      title
      post {
        postReference
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        postMetadataPostMetadataReference
        owner
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      postMetadataPostPostReference
      owner
    }
  }
`;
export const deletePostMetadata = /* GraphQL */ `
  mutation DeletePostMetadata(
    $input: DeletePostMetadataInput!
    $condition: ModelPostMetadataConditionInput
  ) {
    deletePostMetadata(input: $input, condition: $condition) {
      postMetadataReference
      title
      post {
        postReference
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        postMetadataPostMetadataReference
        owner
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      postMetadataPostPostReference
      owner
    }
  }
`;
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      postReference
      title
      comments {
        nextToken
        startedAt
      }
      metadata {
        postMetadataReference
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        postMetadataPostPostReference
        owner
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      postMetadataPostMetadataReference
      owner
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      postReference
      title
      comments {
        nextToken
        startedAt
      }
      metadata {
        postMetadataReference
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        postMetadataPostPostReference
        owner
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      postMetadataPostMetadataReference
      owner
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      postReference
      title
      comments {
        nextToken
        startedAt
      }
      metadata {
        postMetadataReference
        title
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        postMetadataPostPostReference
        owner
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      postMetadataPostMetadataReference
      owner
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      commentReference
      title
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      postCommentsPostReference
      owner
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      commentReference
      title
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      postCommentsPostReference
      owner
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      commentReference
      title
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      postCommentsPostReference
      owner
    }
  }
`;
export const createFoo = /* GraphQL */ `
  mutation CreateFoo(
    $input: CreateFooInput!
    $condition: ModelFooConditionInput
  ) {
    createFoo(input: $input, condition: $condition) {
      id
      bars {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const updateFoo = /* GraphQL */ `
  mutation UpdateFoo(
    $input: UpdateFooInput!
    $condition: ModelFooConditionInput
  ) {
    updateFoo(input: $input, condition: $condition) {
      id
      bars {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const deleteFoo = /* GraphQL */ `
  mutation DeleteFoo(
    $input: DeleteFooInput!
    $condition: ModelFooConditionInput
  ) {
    deleteFoo(input: $input, condition: $condition) {
      id
      bars {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const createBar = /* GraphQL */ `
  mutation CreateBar(
    $input: CreateBarInput!
    $condition: ModelBarConditionInput
  ) {
    createBar(input: $input, condition: $condition) {
      id
      foos {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const updateBar = /* GraphQL */ `
  mutation UpdateBar(
    $input: UpdateBarInput!
    $condition: ModelBarConditionInput
  ) {
    updateBar(input: $input, condition: $condition) {
      id
      foos {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const deleteBar = /* GraphQL */ `
  mutation DeleteBar(
    $input: DeleteBarInput!
    $condition: ModelBarConditionInput
  ) {
    deleteBar(input: $input, condition: $condition) {
      id
      foos {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const createFooBar = /* GraphQL */ `
  mutation CreateFooBar(
    $input: CreateFooBarInput!
    $condition: ModelFooBarConditionInput
  ) {
    createFooBar(input: $input, condition: $condition) {
      id
      fooId
      barId
      foo {
        id
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      bar {
        id
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const updateFooBar = /* GraphQL */ `
  mutation UpdateFooBar(
    $input: UpdateFooBarInput!
    $condition: ModelFooBarConditionInput
  ) {
    updateFooBar(input: $input, condition: $condition) {
      id
      fooId
      barId
      foo {
        id
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      bar {
        id
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const deleteFooBar = /* GraphQL */ `
  mutation DeleteFooBar(
    $input: DeleteFooBarInput!
    $condition: ModelFooBarConditionInput
  ) {
    deleteFooBar(input: $input, condition: $condition) {
      id
      fooId
      barId
      foo {
        id
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      bar {
        id
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
