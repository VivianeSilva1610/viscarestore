const { databases, DB_ID } = require('./appwrite-admin-client.cjs');

const PRODUCTS_COL_ID = 'products';

async function setupProductsDelivery() {
  try {
    await databases.createIntegerAttribute(DB_ID, PRODUCTS_COL_ID, 'delivery_days', false, 1, 120, 5);
    console.log('Criado: delivery_days');
  } catch (e) {
    console.log(`Ignorado (delivery_days): ${e.message}`);
  }

  console.log('Setup de delivery_days em products finalizado. Aguarde alguns segundos para o Appwrite processar o atributo.');
}

setupProductsDelivery();
