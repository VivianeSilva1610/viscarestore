const sdk = require('node-appwrite');

const client = new sdk.Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610')
    .setKey('standard_d15b590d7c652335d8f3e3ead9d67980def6dfafc3edbfbc94a785171335b10a82ab6f625fe99244cf039a279694964eae3fcdd708c19d03cdddfae448b9e20f39fec2489eb8c859d224817a3f2c2f2f8c74520dfa1b80fb8508fba7ce3c9365a50f3c2c96f81bdb7379eaf996438af29df7baeb1a98462dcb254950762c55a8');

const databases = new sdk.Databases(client);
const DB_ID = '6a390e430024feb8df57';
const COLLECTION_ID = 'products';

const requiredAttributes = [
    { key: 'name_pt', type: 'string', size: 255, required: true },
    { key: 'name_it', type: 'string', size: 255, required: true },
    { key: 'description_pt', type: 'string', size: 5000, required: true },
    { key: 'description_it', type: 'string', size: 5000, required: true },
    { key: 'price', type: 'double', required: true },
    { key: 'category', type: 'string', size: 255, required: true },
    { key: 'image_id', type: 'string', size: 255, required: false },
    { key: 'in_stock', type: 'boolean', required: true },
    { key: 'featured', type: 'boolean', required: true },
    { key: 'sizes', type: 'string', size: 255, required: false },
];

async function checkAndCreateAttributes() {
    try {
        console.log('Fetching existing attributes...');
        const res = await databases.listAttributes(DB_ID, COLLECTION_ID);
        const existingKeys = res.attributes.map(a => a.key);
        console.log('Existing attributes:', existingKeys.join(', '));

        for (const attr of requiredAttributes) {
            if (!existingKeys.includes(attr.key)) {
                console.log(`Creating missing attribute: ${attr.key}...`);
                try {
                    if (attr.type === 'string') {
                        await databases.createStringAttribute(DB_ID, COLLECTION_ID, attr.key, attr.size, attr.required);
                    } else if (attr.type === 'double') {
                        await databases.createFloatAttribute(DB_ID, COLLECTION_ID, attr.key, attr.required);
                    } else if (attr.type === 'boolean') {
                        await databases.createBooleanAttribute(DB_ID, COLLECTION_ID, attr.key, attr.required);
                    }
                    console.log(`Created ${attr.key}`);
                } catch(e) {
                    console.error(`Failed to create ${attr.key}:`, e.message);
                }
            }
        }
        console.log('Finished checking attributes.');
    } catch(e) {
        console.error('Error:', e.message);
    }
}

checkAndCreateAttributes();
