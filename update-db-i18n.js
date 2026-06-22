const sdk = require('node-appwrite');

const client = new sdk.Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610')
    .setKey('standard_d15b590d7c652335d8f3e3ead9d67980def6dfafc3edbfbc94a785171335b10a82ab6f625fe99244cf039a279694964eae3fcdd708c19d03cdddfae448b9e20f39fec2489eb8c859d224817a3f2c2f2f8c74520dfa1b80fb8508fba7ce3c9365a50f3c2c96f81bdb7379eaf996438af29df7baeb1a98462dcb254950762c55a8');

const databases = new sdk.Databases(client);

const DB_ID = '6a390e430024feb8df57';
const PRODUCTS_COL_ID = 'products';
const PAGES_COL_ID = 'pages';
const CATEGORIES_COL_ID = 'categories';

async function safeCreate(fn) {
    try {
        await fn();
        console.log('Criado.');
    } catch (e) {
        if (e.message.includes('already exists')) {
            console.log('Já existe, ignorando.');
        } else {
            console.error('Erro:', e.message);
        }
    }
}

async function updateSchema() {
    console.log('Atualizando Produtos...');
    await safeCreate(() => databases.createStringAttribute(DB_ID, PRODUCTS_COL_ID, 'name_it', 255, false));
    await safeCreate(() => databases.createStringAttribute(DB_ID, PRODUCTS_COL_ID, 'description_it', 5000, false));
    
    console.log('Atualizando Páginas...');
    await safeCreate(() => databases.createStringAttribute(DB_ID, PAGES_COL_ID, 'title_it', 255, false));
    await safeCreate(() => databases.createStringAttribute(DB_ID, PAGES_COL_ID, 'content_it', 5000, false));

    console.log('Atualizando Categorias...');
    await safeCreate(() => databases.createStringAttribute(DB_ID, CATEGORIES_COL_ID, 'name_it', 255, false));

    console.log('Feito.');
}

updateSchema();
