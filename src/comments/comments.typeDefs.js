import { gql } from "apollo-server";

export default gql`
  type Comment {
    id: Int!
    user: User!
    userId: Int!
    photo: Photo!
    payload: String
    createdAt: String!
    updatedAt: String!
    isMine: Boolean!
  }
`;
