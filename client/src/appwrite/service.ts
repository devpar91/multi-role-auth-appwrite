// multi-role-auth-appwrite/client/src/appwrite/service.ts

import { Account, Client, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_URL as string)
  .setProject(process.env.EXPO_PUBLIC_PROJECT_ID as string);

const account = new Account(client);

export const appwrite = {
  client,
  account,
  ID,
};
