import { gql } from "apollo-server";

export default gql`
  type Photo {
    id: Int!
    user: User!
    userId: Int!
    file: String!
    caption: String
    hashtags: [Hashtag]!
    createdAt: String!
    updatedAt: String!
    likes: Int!
    isMine: Boolean!
    commentNumber: Int!
    comments: [Comment]
    isLiked: Boolean!
  }
  type Hashtag {
    id: Int!
    hashtag: String!
    photos(page: Int!): [Photo]!
    totalPages: Int!
    createdAt: String!
    updatedAt: String!
    totalPhotos: Int!
  }
  type Like {
    id: Int!
    photo: Photo!
    createdAt: String!
    updatedAt: String!
  }
`;
