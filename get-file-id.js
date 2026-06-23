const sdk = require('node-appwrite');
const client = new sdk.Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610')
    .setKey('standard_d15b590d7c652335d8f3e3ead9d67980def6dfafc3edbfbc94a785171335b10a82ab6f625fe99244cf039a279694964eae3fcdd708c19d03cdddfae448b9e20f39fec2489eb8c859d224817a3f2c2f2f8c74520dfa1b80fb8508fba7ce3c9365a50f3c2c96f81bdb7379eaf996438af29df7baeb1a98462dcb254950762c55a8');
const storage = new sdk.Storage(client);
storage.listFiles('6a391020001d02651b57').then(r => {
    if (r.files.length > 0) {
        console.log("File ID:", r.files[0].$id);
    } else {
        console.log("No files");
    }
}).catch(console.error);
