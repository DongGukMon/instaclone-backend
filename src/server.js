require("dotenv").config();

import { typeDefs, resolvers } from "./schema.js";
import { getUser } from "./users/user.utils";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import logger from "morgan";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";

import { createServer } from "http";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const schema = makeExecutableSchema({ typeDefs, resolvers });

const PORT = process.env.PORT;

const startServer = async () => {
  const app = express();
  app.use(logger("tiny"));
  app.use(graphqlUploadExpress()); //applyMiddleware보다 무조건 먼저 선언되어야 한다.
  app.use("/static", express.static("uploads"));

  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: "/graphql",
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.

  const serverCleanup = useServer(
    {
      schema,
      //아래와 같이 연결되었을 때와 연결 해제 되었을 때 함수를 지정할 수 있음
      // onConnect: (params) => console.log(parmas)
      // onDisconnect:(params)=>console.log(params)
      context: async ({ connectionParams }) => {
        if (connectionParams) {
          return {
            loggedInUser: await getUser(connectionParams.authorization),
          };
        }
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      if (req) {
        return {
          loggedInUser: await getUser(req.headers.authorization),
        };
      }
    },
    // csrfPrevention: true,
    // cache: "bounded",
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

  server.applyMiddleware({ app });

  httpServer.listen({ port: PORT }, () => {
    console.log(`🚀 Server: http://localhost:${PORT}${server.graphqlPath}`);
  });
};
startServer();
