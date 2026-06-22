const sdk = require('node-appwrite');

const client = new sdk.Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610')
    .setKey('standard_d15b590d7c652335d8f3e3ead9d67980def6dfafc3edbfbc94a785171335b10a82ab6f625fe99244cf039a279694964eae3fcdd708c19d03cdddfae448b9e20f39fec2489eb8c859d224817a3f2c2f2f8c74520dfa1b80fb8508fba7ce3c9365a50f3c2c96f81bdb7379eaf996438af29df7baeb1a98462dcb254950762c55a8');

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

const DB_ID = '6a390e430024feb8df57';
const COLLECTION_ID = 'products';
const BUCKET_ID = '6a391020001d02651b57';

async function setup() {
    try {
        console.log('Creating database...');
        try {
            await databases.create(DB_ID, 'VisCare Database');
            console.log('Database created.');
        } catch(e) { console.log('DB:', e.message); }

        console.log('Creating collection...');
        try {
            await databases.createCollection(DB_ID, COLLECTION_ID, 'Products', [
                sdk.Permission.read(sdk.Role.any()),
                sdk.Permission.create(sdk.Role.users()),
                sdk.Permission.update(sdk.Role.users()),
                sdk.Permission.delete(sdk.Role.users()),
            ]);
            console.log('Collection created.');
        } catch(e) { console.log('Collection:', e.message); }

        console.log('Creating attributes...');
        try {
            await databases.createStringAttribute(DB_ID, COLLECTION_ID, 'name_pt', 255, true);
            await databases.createStringAttribute(DB_ID, COLLECTION_ID, 'name_it', 255, true);
            await databases.createStringAttribute(DB_ID, COLLECTION_ID, 'description_pt', 5000, true);
            await databases.createStringAttribute(DB_ID, COLLECTION_ID, 'description_it', 5000, true);
            await databases.createFloatAttribute(DB_ID, COLLECTION_ID, 'price', true);
            await databases.createStringAttribute(DB_ID, COLLECTION_ID, 'category', 255, true);
            await databases.createStringAttribute(DB_ID, COLLECTION_ID, 'image_id', 255, false);
            await databases.createBooleanAttribute(DB_ID, COLLECTION_ID, 'in_stock', true);
            await databases.createBooleanAttribute(DB_ID, COLLECTION_ID, 'featured', true);
            await databases.createStringAttribute(DB_ID, COLLECTION_ID, 'sizes', 255, false);
            console.log('Attributes creation initiated.');
        } catch(e) { console.log('Attributes:', e.message); }

        console.log('Creating bucket...');
        try {
            await storage.createBucket(BUCKET_ID, 'VisCare Images', [
                sdk.Permission.read(sdk.Role.any()),
                sdk.Permission.create(sdk.Role.any()),
                sdk.Permission.update(sdk.Role.any()),
                sdk.Permission.delete(sdk.Role.any()),
            ], false, false, undefined, ['jpg', 'png', 'jpeg', 'webp']);
            console.log('Bucket created.');
        } catch(e) { console.log('Bucket:', e.message); }

        console.log('Setup finished successfully!');
    } catch(error) {
        console.error('Setup failed', error);
    }
}

setup();
