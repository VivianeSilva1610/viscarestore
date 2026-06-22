const { Client, Databases } = require('appwrite');

const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610');

const databases = new Databases(client);

async function check() {
    try {
        const res = await databases.listDocuments('6a390e430024feb8df57', 'pages');
        console.log(res.documents.map(d => ({slug: d.slug, title: d.title, contentLength: d.content.length})));
    } catch(e) {
        console.error("Error:", e);
    }
}
check();
