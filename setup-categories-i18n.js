const { databases, DB_ID } = require('./appwrite-admin-client.cjs');

const CATEGORIES_COL_ID = 'categories';

async function addItalianLabel() {
  try {
    await databases.createStringAttribute(DB_ID, CATEGORIES_COL_ID, 'label_it', 255, false);
    console.log('Atributo label_it criado na collection categories.');
  } catch (e) {
    console.log('Ignorado (pode já existir):', e.message);
  }
  console.log('Pronto! Agora preencha o campo "Nome em Italiano" para cada categoria no painel admin.');
}

addItalianLabel();
