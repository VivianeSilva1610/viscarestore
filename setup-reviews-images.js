require('dotenv').config({ path: '.env.local' });
const { databases } = require('./appwrite-admin-client.cjs');

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a390e430024feb8df57';
const COL_ID = 'reviews';

async function run() {
  try {
    await databases.createStringAttribute(DB_ID, COL_ID, 'images', 500, false, null, true);
    console.log('Atributo "images" (array) criado na coleção reviews.');
  } catch (e) {
    console.log('Ignorado (images):', e.message);
  }
  console.log('Pronto.');
}

run();
