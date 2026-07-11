require('dotenv').config({ path: '.env.local' });
const sdk = require('node-appwrite');

const { databases } = require('./appwrite-admin-client.cjs');

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a390e430024feb8df57';
const COL_ID = process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID || 'categories';

async function run() {
  try {
    await databases.createBooleanAttribute(DB_ID, COL_ID, 'active', false, true);
    console.log('Atributo "active" criado com default true.');
  } catch (e) {
    console.log('Ignorado (active):', e.message);
  }
  console.log('Pronto. Aguarde alguns segundos para o Appwrite processar.');
}

run();
