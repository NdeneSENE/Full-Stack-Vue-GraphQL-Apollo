import { gql } from "apollo-boost";

// Posts Queries
export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      imageUrl
    }
  }
`;

export const GET_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      _id
      title
      imageUrl
      categories
      description
      likes
      createdDate
      messages {
        _id
        messageBody
        messageDate
        messageUser {
          _id
          username
          avatar
        }
      }
    }
  }
`;

export const INFINITE_SCROLL_POSTS = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
      hasMore
      posts {
        _id
        title
        imageUrl
        categories
        description
        likes
        createdDate
        messages {
          _id
        }
        createdBy {
          _id
          username
          avatar
        }
      }
    }
  }
`;

// Users Queries
export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      _id
      username
      email
      password
      avatar
      joinDate
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;
// Posts Mutations
export const ADD_POST = gql`
  mutation(
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $description: String!
    $creatorId: ID!
  ) {
    addPost(
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
      creatorId: $creatorId
    ) {
      _id
      title
      imageUrl
      categories
      description
    }
  }
`;

export const ADD_POST_MESSAGE = gql`
  mutation($messageBody: String!, $postId: ID!, $userId: ID!) {
    addPostMessage(
      messageBody: $messageBody
      userId: $userId
      postId: $postId
    ) {
      _id
      messageBody
      messageDate
      messageUser {
        _id
        username
        avatar
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation($postId: ID!, $username: String!) {
    likePost(postId: $postId, username: $username) {
      likes
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation($postId: ID!, $username: String!) {
    unlikePost(postId: $postId, username: $username) {
      likes
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;

// Users Mutations
export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    singinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;
