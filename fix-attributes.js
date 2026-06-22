const sdk = require('node-appwrite');

const client = new sdk.Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610')
    .setKey('standard_d15b590d7c652335d8f3e3ead9d67980def6dfafc3edbfbc94a785171335b10a82ab6f625fe99244cf039a279694964eae3fcdd708c19d03cdddfae448b9e20f39fec2489eb8c859d224817a3f2c2f2f8c74520dfa1b80fb8508fba7ce3c9365a50f3c2c96f81bdb7379eaf996438af29df7baeb1a98462dcb254950762c55a8');

const databases = new sdk.Databases(client);
const DB_ID = '6a390e430024feb8df57';
const COLLECTION_ID = 'products';

async function fixAttributes() {
    try {
        console.log('Fetching attributes...');
        const res = await databases.listAttributes(DB_ID, COLLECTION_ID);
        
        for (const attr of res.attributes) {
            console.log(`- ${attr.key}: ${attr.type}`);
            if (attr.key === 'in_stock' && attr.type !== 'boolean') {
                console.log('Deleting wrong in_stock...');
                await databases.deleteAttribute(DB_ID, COLLECTION_ID, 'in_stock');
            }
            if (attr.key === 'featured' && attr.type !== 'boolean') {
                console.log('Deleting wrong featured...');
                await databases.deleteAttribute(DB_ID, COLLECTION_ID, 'featured');
            }
            if (attr.key === 'price' && attr.type !== 'double') {
                console.log('Deleting wrong price...');
                await databases.deleteAttribute(DB_ID, COLLECTION_ID, 'price');
            }
        }
        
        // Wait a few seconds for deletion to process
        console.log('Waiting 3 seconds for deletion to complete...');
        await new Promise(r => setTimeout(r, 3000));
        
        console.log('Recreating correctly typed attributes...');
        try { await databases.createBooleanAttribute(DB_ID, COLLECTION_ID, 'in_stock', true); } catch(e){}
        try { await databases.createBooleanAttribute(DB_ID, COLLECTION_ID, 'featured', true); } catch(e){}
        try { await databases.createFloatAttribute(DB_ID, COLLECTION_ID, 'price', true); } catch(e){}
        
        console.log('Done!');
    } catch(e) {
        console.error('Error:', e.message);
    }
}

fixAttributes();
