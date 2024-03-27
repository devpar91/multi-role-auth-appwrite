// multi-role-auth-appwrite/server/src/appwrite/index.ts

import { Client, Users, ID, AppwriteException } from "node-appwrite";
import "dotenv/config";

const createAppwriteClient = (jwtToken: string) => {
  return new Client()
    .setEndpoint(process.env.APPWRITE_URL)
    .setProject(process.env.PROJECT_ID)
    .setJWT(jwtToken);
};

const signup = async (
  email: string,
  password: string,
  name: string,
  seller?: boolean
) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_URL)
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.API_KEY);

  const users = new Users(client);

  try {
    // Create user
    var userId = ID.unique();
    let user = await users.create(userId, email, null, password, name);

    // Update user labels
    if (seller) {
      user = await users.updateLabels(user.$id, ["seller"]);
    }

    return { error: undefined, data: user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: error as AppwriteException, data: undefined };
  }
};

export const appwrite = {
  signup,
};
