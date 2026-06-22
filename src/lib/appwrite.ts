import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

const endpoint = (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1').trim();
const projectId = (process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '').trim();

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
