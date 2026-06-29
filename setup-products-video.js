const { databases, DB_ID } = require('./appwrite-admin-client.cjs');

const PRODUCTS_COL_ID = 'products';

async function setupProductsVideo() {
  try {
    await databases.createStringAttribute(DB_ID, PRODUCTS_COL_ID, 'video_id', 64, false);
    console.log('Criado: video_id');
  } catch (e) {
    console.log(`Ignorado (video_id): ${e.message}`);
  }
  console.log('Setup de video_id em products finalizado.');
}

setupProductsVideo();
