const sdk = require('node-appwrite');

const client = new sdk.Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610')
    .setKey('standard_d15b590d7c652335d8f3e3ead9d67980def6dfafc3edbfbc94a785171335b10a82ab6f625fe99244cf039a279694964eae3fcdd708c19d03cdddfae448b9e20f39fec2489eb8c859d224817a3f2c2f2f8c74520dfa1b80fb8508fba7ce3c9365a50f3c2c96f81bdb7379eaf996438af29df7baeb1a98462dcb254950762c55a8');

const databases = new sdk.Databases(client);
const DB_ID = '6a390e430024feb8df57';
const COLLECTION_ID = 'products';

async function updateAttributeSize() {
    try {
        console.log('Updating description_pt...');
        await databases.updateStringAttribute(DB_ID, COLLECTION_ID, 'description_pt', false, null, 10000);
        console.log('description_pt updated.');
    } catch(e) { console.error(e.message); }

    try {
        console.log('Updating description_it...');
        await databases.updateStringAttribute(DB_ID, COLLECTION_ID, 'description_it', false, null, 10000);
        console.log('description_it updated.');
    } catch(e) { console.error(e.message); }
}

updateAttributeSize();
