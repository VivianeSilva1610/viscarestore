const { Client, Databases, Query } = require('appwrite');

const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610');

const databases = new Databases(client);

async function test() {
    try {
        const res = await databases.listDocuments('6a390e430024feb8df57', 'pages', [
            Query.equal('slug', 'sobre-a-viscaree')
        ]);
        console.log(res);
    } catch(e) {
        console.error("Error:", e);
    }
}

test();
