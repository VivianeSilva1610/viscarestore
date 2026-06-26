const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610');

const db = new Databases(client);

async function run() {
    try {
        const res = await db.listDocuments('6a390e430024feb8df57', 'pages');
        console.log(JSON.stringify(res, null, 2));
    } catch (e) {
        console.error(e);
    }
}
run();
