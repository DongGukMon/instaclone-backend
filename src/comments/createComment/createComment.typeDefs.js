import { gql } from "apollo-server";

export default gql`
  type Mutation {
    createComment(payload: String!, photoId: Int!): mutationResponse!
  }
`;
