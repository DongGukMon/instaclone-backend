import { gql } from "apollo-server";

export default gql`
  type SendMessageResponse {
    ok: Boolean!
    error: String
    id: Int
  }
  type Mutation {
    sendMessage(
      payload: String!
      roomId: Int
      userId: Int
    ): SendMessageResponse!
  }
`;
