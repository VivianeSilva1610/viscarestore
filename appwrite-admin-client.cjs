require('dotenv').config({ path: '.env.local' });
const sdk = require('node-appwrite');

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'viscareelojavirtual1610';
const apiKey = process.env.APPWRITE_API_KEY;

if (!apiKey) {
  throw new Error('APPWRITE_API_KEY nao definida em .env.local. Veja .env.local.example.');
}

const client = new sdk.Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a390e430024feb8df57';
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '6a391020001d02651b57';

module.exports = {
  sdk,
  client,
  databases: new sdk.Databases(client),
  storage: new sdk.Storage(client),
  DB_ID,
  BUCKET_ID,
};
