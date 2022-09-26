import { gql } from "apollo-server";

export default gql`
  type LoginResult {
    ok: Boolean!
    token: String
    error: String
    id: Int
  }
  type Mutation {
    login(username: String!, password: String!): LoginResult!
  }
`;
