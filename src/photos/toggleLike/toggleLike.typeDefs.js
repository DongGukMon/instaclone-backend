import { gql } from "apollo-server";

export default gql`
  type toggleLikeResult {
    ok: Boolean!
    result: String
    error: String
  }
  type Mutation {
    toggleLike(id: Int!): toggleLikeResult!
  }
`;
