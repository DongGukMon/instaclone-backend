import { gql } from "apollo-server";

export default gql`
  type followResponse {
    ok: String!
    error: String
    id: Int
  }
  type Mutation {
    followUser(username: String!): followResponse!
  }
`;
