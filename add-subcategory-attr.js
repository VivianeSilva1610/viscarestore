// Roda: node add-subcategory-attr.js
// Adiciona o atributo subcategory (string, opcional) na coleção products do Appwrite

require("dotenv").config({ path: ".env.local", quiet: true });
const { Client, Databases } = require("node-appwrite");

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "viscareelojavirtual1610")
  .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57";
const COL_ID = "products";

async function main() {
  try {
    await db.createStringAttribute(DB_ID, COL_ID, "subcategory", 40, false, "");
    console.log("✅ Atributo subcategory criado com sucesso.");
  } catch (e) {
    if (e.message?.includes("already exists") || e.code === 409) {
      console.log("ℹ️  Atributo subcategory já existe.");
    } else {
      console.error("❌ Erro:", e.message);
    }
  }
}

main();
