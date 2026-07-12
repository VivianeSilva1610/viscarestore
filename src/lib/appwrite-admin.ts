import { Client, Databases, Storage } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "viscareelojavirtual1610";
const apiKey = process.env.APPWRITE_API_KEY as string;

const adminClient = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

export const adminDatabases = new Databases(adminClient);
export const adminStorage = new Storage(adminClient);

export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57";
export const ORDERS_COL_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || "orders";
export const PRODUCTS_COL_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID || "products";
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "6a391020001d02651b57";
export const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
export const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "viscareelojavirtual1610";
