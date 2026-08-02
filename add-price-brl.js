// Roda: node add-price-brl.js
// Adiciona o atributo price_brl (float) na coleção products do Appwrite

require("dotenv").config({ path: ".env.local" });
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
    await db.createFloatAttribute(DB_ID, COL_ID, "price_brl", false, 0);
    console.log("✅ Atributo price_brl criado com sucesso.");
  } catch (e) {
    if (e.message?.includes("already exists") || e.code === 409) {
      console.log("ℹ️  Atributo price_brl já existe.");
    } else {
      console.error("❌ Erro:", e.message);
    }
  }
}

main();
