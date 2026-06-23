import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

const endpoint = "https://fra.cloud.appwrite.io/v1";
const projectId = "viscareelojavirtual1610";

client
    .setEndpoint(endpoint)
    .setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Helper function to check if appwrite is fully configured
export const isAppwriteConfigured = () => {
  return projectId !== '';
};

export default client;
