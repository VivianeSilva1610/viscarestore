const sdk = require('node-appwrite');

const client = new sdk.Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610')
    .setKey('standard_d15b590d7c652335d8f3e3ead9d67980def6dfafc3edbfbc94a785171335b10a82ab6f625fe99244cf039a279694964eae3fcdd708c19d03cdddfae448b9e20f39fec2489eb8c859d224817a3f2c2f2f8c74520dfa1b80fb8508fba7ce3c9365a50f3c2c96f81bdb7379eaf996438af29df7baeb1a98462dcb254950762c55a8');

const databases = new sdk.Databases(client);
const DB_ID = '6a390e430024feb8df57';
const NEWSLETTER_COL_ID = 'newsletter';

async function setupNewsletter() {
    try {
        console.log('Creating newsletter collection...');
        try {
            await databases.createCollection(DB_ID, NEWSLETTER_COL_ID, 'Newsletter', [
                sdk.Permission.create(sdk.Role.any()), 
                sdk.Permission.read(sdk.Role.users()), 
                sdk.Permission.update(sdk.Role.users()), 
                sdk.Permission.delete(sdk.Role.users()), 
            ]);
            console.log('Collection created.');
        } catch(e) { console.log('Collection might exist:', e.message); }

        console.log('Creating attributes...');
        const createAttr = async (fn) => { try { await fn(); } catch(e) { console.log('Attr might exist:', e.message); } };
        
        await createAttr(() => databases.createEmailAttribute(DB_ID, NEWSLETTER_COL_ID, 'email', true));
        await createAttr(() => databases.createStringAttribute(DB_ID, NEWSLETTER_COL_ID, 'status', 20, false, "active"));
        console.log('Attributes created/initiated.');

        console.log('Setup finished successfully!');
    } catch(error) {
        console.error('Setup failed', error);
    }
}

setupNewsletter();
