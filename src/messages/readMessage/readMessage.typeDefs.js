import { gql } from "apollo-server";

export default gql`
  type readMessageReponse {
    ok: Boolean!
    error: String
    id: Int
  }
  type Mutation {
    readMessage(id: Int!): mutationResponse
  }
`;
