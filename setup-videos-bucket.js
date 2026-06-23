const sdk = require('node-appwrite');

const client = new sdk.Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610')
    .setKey('standard_d15b590d7c652335d8f3e3ead9d67980def6dfafc3edbfbc94a785171335b10a82ab6f625fe99244cf039a279694964eae3fcdd708c19d03cdddfae448b9e20f39fec2489eb8c859d224817a3f2c2f2f8c74520dfa1b80fb8508fba7ce3c9365a50f3c2c96f81bdb7379eaf996438af29df7baeb1a98462dcb254950762c55a8');

const storage = new sdk.Storage(client);

async function setupVideosBucket() {
    try {
        console.log('Creating Videos bucket...');
        try {
            await storage.createBucket('videos', 'VisCare Videos', [
                sdk.Permission.read(sdk.Role.any()),
                sdk.Permission.create(sdk.Role.any()),
                sdk.Permission.update(sdk.Role.any()),
                sdk.Permission.delete(sdk.Role.any()),
            ], false, false, undefined, ['mp4', 'webm', 'mov', 'avi']);
            console.log('Videos Bucket created.');
        } catch(e) { 
            console.log('Bucket might exist or error:', e.message); 
            
            // try to update it just in case it exists but needs new extensions
            try {
                await storage.updateBucket('videos', 'VisCare Videos', [
                    sdk.Permission.read(sdk.Role.any()),
                    sdk.Permission.create(sdk.Role.any()),
                    sdk.Permission.update(sdk.Role.any()),
                    sdk.Permission.delete(sdk.Role.any()),
                ], false, false, undefined, ['mp4', 'webm', 'mov', 'avi']);
                console.log('Videos Bucket updated with correct permissions and extensions.');
            } catch (err) {
                console.log('Could not update bucket:', err.message);
            }
        }
        console.log('Setup finished successfully!');
    } catch(error) {
        console.error('Setup failed', error);
    }
}

setupVideosBucket();
