/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPostMetadata = /* GraphQL */ `
  query GetPostMetadata($postMetadataReference: ID!) {
    getPostMetadata(postMetadataReference: $postMetadataReference) {
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
export const listPostMetadata = /* GraphQL */ `
  query ListPostMetadata(
    $postMetadataReference: ID
    $filter: ModelPostMetadataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPostMetadata(
      postMetadataReference: $postMetadataReference
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncPostMetadata = /* GraphQL */ `
  query SyncPostMetadata(
    $filter: ModelPostMetadataFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPostMetadata(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($postReference: ID!) {
    getPost(postReference: $postReference) {
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
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $postReference: ID
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPosts(
      postReference: $postReference
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncPosts = /* GraphQL */ `
  query SyncPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPosts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($commentReference: ID!) {
    getComment(commentReference: $commentReference) {
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
export const listComments = /* GraphQL */ `
  query ListComments(
    $commentReference: ID
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listComments(
      commentReference: $commentReference
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncComments = /* GraphQL */ `
  query SyncComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncComments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getFoo = /* GraphQL */ `
  query GetFoo($id: ID!) {
    getFoo(id: $id) {
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
export const listFoos = /* GraphQL */ `
  query ListFoos(
    $filter: ModelFooFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFoos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncFoos = /* GraphQL */ `
  query SyncFoos(
    $filter: ModelFooFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncFoos(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const getBar = /* GraphQL */ `
  query GetBar($id: ID!) {
    getBar(id: $id) {
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
export const listBars = /* GraphQL */ `
  query ListBars(
    $filter: ModelBarFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBars(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncBars = /* GraphQL */ `
  query SyncBars(
    $filter: ModelBarFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncBars(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const getFooBar = /* GraphQL */ `
  query GetFooBar($id: ID!) {
    getFooBar(id: $id) {
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
export const listFooBars = /* GraphQL */ `
  query ListFooBars(
    $filter: ModelFooBarFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFooBars(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        fooId
        barId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncFooBars = /* GraphQL */ `
  query SyncFooBars(
    $filter: ModelFooBarFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncFooBars(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        fooId
        barId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
