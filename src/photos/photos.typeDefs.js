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
`;