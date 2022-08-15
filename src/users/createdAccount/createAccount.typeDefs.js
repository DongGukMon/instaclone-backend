import {gql} from "apollo-server";

export default gql`
    scalar Upload
    type CreateAccountResult {
        ok: Boolean!
        error: String
    }
    type Mutation {
        createAccount(
            firstName: String!
            lastName: String
            username: String!
            email: String!
            password: String!
        ) : CreateAccountResult!
    }
`