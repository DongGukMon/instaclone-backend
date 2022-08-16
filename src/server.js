require("dotenv").config();

import { typeDefs, resolvers } from "./schema.js";
import { getUser } from "./users/user.utils";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import logger from "morgan";

import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";

const PORT = process.env.PORT;

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.authorization),
      };
    },
  });

  await server.start();
  const app = express();
  app.use(logger("tiny"));
  app.use(graphqlUploadExpress()); //applyMiddleware보다 무조건 먼저 선언되어야 한다.
  server.applyMiddleware({ app });
  app.use("/static", express.static("uploads"));

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server: http://localhost:${PORT}${server.graphqlPath}`);
  });
};
startServer();
