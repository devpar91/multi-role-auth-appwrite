// multi-role-auth-appwrite/server/src/appwrite/index.ts

import { Client } from "node-appwrite";
import "dotenv/config";

const createAppwriteClient = (jwtToken: string) => {
  return new Client()
    .setEndpoint(process.env.APPWRITE_URL)
    .setProject(process.env.PROJECT_ID)
    .setJWT(jwtToken);
};
