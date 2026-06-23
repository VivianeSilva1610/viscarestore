const sdk = require('node-appwrite');

const client = new sdk.Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610')
    .setKey('standard_d15b590d7c652335d8f3e3ead9d67980def6dfafc3edbfbc94a785171335b10a82ab6f625fe99244cf039a279694964eae3fcdd708c19d03cdddfae448b9e20f39fec2489eb8c859d224817a3f2c2f2f8c74520dfa1b80fb8508fba7ce3c9365a50f3c2c96f81bdb7379eaf996438af29df7baeb1a98462dcb254950762c55a8');

const storage = new sdk.Storage(client);
const databases = new sdk.Databases(client);

async function testUrl() {
    try {
        const prodRes = await databases.listDocuments('6a390e430024feb8df57', 'products');
        if (prodRes.documents.length > 0) {
            const doc = prodRes.documents[0];
            if (doc.image_id) {
                const url = storage.getFileView('6a391020001d02651b57', doc.image_id);
                console.log('Image URL:', url);
                
                // test fetch
                const res = await fetch(url.toString());
                console.log('Fetch status:', res.status);
            } else {
                console.log('No image_id on first product');
            }
        }
    } catch(e) { console.error(e); }
}

testUrl();
