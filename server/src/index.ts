// multi-role-auth-appwrite/server/src/index.ts

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { readFileSync } from "fs";
import resolvers from "./resolvers/index.js";
import { appwrite } from "./appwrite/index.js";

const typeDefs = readFileSync("./src/schema.graphql", { encoding: "utf-8" });

export interface MyContext {
  token?: String;
}

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(express.json());
app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

app.post("/signup", async (req, res) => {
  console.log("req.body: ", req.body);
  const {
    email,
    password,
    name,
    chef,
  }: { email: string; password: string; name: string; chef?: boolean } =
    req.body;
  const result = await appwrite.signup(email, password, name, chef);
  res.send(result);
});

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
