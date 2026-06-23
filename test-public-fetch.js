const sdk = require('node-appwrite');

const client = new sdk.Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610');
    // Notice: NO API KEY IS SET. This simulates the public server/client fetch.

const databases = new sdk.Databases(client);
const DB_ID = '6a390e430024feb8df57';
const PAGES_COL_ID = 'pages';

async function testFetch() {
    try {
        console.log('Fetching pages as public user...');
        const res = await databases.listDocuments(DB_ID, PAGES_COL_ID, [
            sdk.Query.equal('slug', 'sobre-a-viscaree')
        ]);
        console.log('Result:', res);
    } catch (e) {
        console.error('Error fetching pages:', e.message);
    }
}

testFetch();
