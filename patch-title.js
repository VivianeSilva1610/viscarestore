const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610');

const databases = new Databases(client);

const DB_ID = "6a390e430024feb8df57";
const PAGES_COL_ID = "pages";

async function run() {
    try {
        const response = await databases.listDocuments(DB_ID, PAGES_COL_ID, [Query.equal("slug", "global-settings")]);
        if (response.documents.length > 0) {
            const doc = response.documents[0];
            let settings = JSON.parse(doc.content);
            settings.gridTitleIt = "COLLEZIONE BRASILE";
            console.log("Updating settings to:", settings);
            await databases.updateDocument(DB_ID, PAGES_COL_ID, doc.$id, {
                content: JSON.stringify(settings)
            });
            console.log("Done");
        }
    } catch(err) {
        console.error(err);
    }
}
run();
