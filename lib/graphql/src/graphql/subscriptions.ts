/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePostMetadata = /* GraphQL */ `
  subscription OnCreatePostMetadata(
    $filter: ModelSubscriptionPostMetadataFilterInput
    $owner: String
  ) {
    onCreatePostMetadata(filter: $filter, owner: $owner) {
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
export const onUpdatePostMetadata = /* GraphQL */ `
  subscription OnUpdatePostMetadata(
    $filter: ModelSubscriptionPostMetadataFilterInput
    $owner: String
  ) {
    onUpdatePostMetadata(filter: $filter, owner: $owner) {
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
export const onDeletePostMetadata = /* GraphQL */ `
  subscription OnDeletePostMetadata(
    $filter: ModelSubscriptionPostMetadataFilterInput
    $owner: String
  ) {
    onDeletePostMetadata(filter: $filter, owner: $owner) {
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
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onCreatePost(filter: $filter, owner: $owner) {
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onUpdatePost(filter: $filter, owner: $owner) {
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onDeletePost(filter: $filter, owner: $owner) {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onCreateComment(filter: $filter, owner: $owner) {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onUpdateComment(filter: $filter, owner: $owner) {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onDeleteComment(filter: $filter, owner: $owner) {
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
export const onCreateFoo = /* GraphQL */ `
  subscription OnCreateFoo(
    $filter: ModelSubscriptionFooFilterInput
    $owner: String
  ) {
    onCreateFoo(filter: $filter, owner: $owner) {
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
export const onUpdateFoo = /* GraphQL */ `
  subscription OnUpdateFoo(
    $filter: ModelSubscriptionFooFilterInput
    $owner: String
  ) {
    onUpdateFoo(filter: $filter, owner: $owner) {
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
export const onDeleteFoo = /* GraphQL */ `
  subscription OnDeleteFoo(
    $filter: ModelSubscriptionFooFilterInput
    $owner: String
  ) {
    onDeleteFoo(filter: $filter, owner: $owner) {
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
export const onCreateBar = /* GraphQL */ `
  subscription OnCreateBar(
    $filter: ModelSubscriptionBarFilterInput
    $owner: String
  ) {
    onCreateBar(filter: $filter, owner: $owner) {
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
export const onUpdateBar = /* GraphQL */ `
  subscription OnUpdateBar(
    $filter: ModelSubscriptionBarFilterInput
    $owner: String
  ) {
    onUpdateBar(filter: $filter, owner: $owner) {
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
export const onDeleteBar = /* GraphQL */ `
  subscription OnDeleteBar(
    $filter: ModelSubscriptionBarFilterInput
    $owner: String
  ) {
    onDeleteBar(filter: $filter, owner: $owner) {
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
export const onCreateFooBar = /* GraphQL */ `
  subscription OnCreateFooBar(
    $filter: ModelSubscriptionFooBarFilterInput
    $owner: String
  ) {
    onCreateFooBar(filter: $filter, owner: $owner) {
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
export const onUpdateFooBar = /* GraphQL */ `
  subscription OnUpdateFooBar(
    $filter: ModelSubscriptionFooBarFilterInput
    $owner: String
  ) {
    onUpdateFooBar(filter: $filter, owner: $owner) {
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
export const onDeleteFooBar = /* GraphQL */ `
  subscription OnDeleteFooBar(
    $filter: ModelSubscriptionFooBarFilterInput
    $owner: String
  ) {
    onDeleteFooBar(filter: $filter, owner: $owner) {
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
