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

async function updatePermissions() {
    try {
        console.log('Updating Collection Permissions...');
        await databases.updateCollection(DB_ID, COLLECTION_ID, 'Products', [
            sdk.Permission.read(sdk.Role.any()), // Anyone can view products
            sdk.Permission.create(sdk.Role.users()), // Logged in users (admin) can create
            sdk.Permission.update(sdk.Role.users()), // Logged in users can update
            sdk.Permission.delete(sdk.Role.users()), // Logged in users can delete
        ]);
        console.log('Collection Permissions Updated!');

        console.log('Updating Bucket Permissions...');
        await storage.updateBucket(BUCKET_ID, 'VisCare Images', [
            sdk.Permission.read(sdk.Role.any()), // Anyone can view images
            sdk.Permission.create(sdk.Role.users()), // Admins can upload
            sdk.Permission.update(sdk.Role.users()), // Admins can update
            sdk.Permission.delete(sdk.Role.users()), // Admins can delete
        ], false, false, undefined, ['jpg', 'png', 'jpeg', 'webp', 'gif', 'svg']);
        console.log('Bucket Permissions Updated!');
    } catch (e) {
        console.error('Error updating permissions:', e.message);
    }
}

updatePermissions();
