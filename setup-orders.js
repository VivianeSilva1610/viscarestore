const sdk = require('node-appwrite');

const client = new sdk.Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610')
    .setKey('standard_d15b590d7c652335d8f3e3ead9d67980def6dfafc3edbfbc94a785171335b10a82ab6f625fe99244cf039a279694964eae3fcdd708c19d03cdddfae448b9e20f39fec2489eb8c859d224817a3f2c2f2f8c74520dfa1b80fb8508fba7ce3c9365a50f3c2c96f81bdb7379eaf996438af29df7baeb1a98462dcb254950762c55a8');

const databases = new sdk.Databases(client);
const DB_ID = '6a390e430024feb8df57';
const ORDERS_COL_ID = 'orders';

async function setupOrders() {
    try {
        console.log('Creating orders collection...');
        try {
            await databases.createCollection(DB_ID, ORDERS_COL_ID, 'Orders', [
                sdk.Permission.read(sdk.Role.any()), // allows admin and api to read
                sdk.Permission.create(sdk.Role.any()), // allows api to create
                sdk.Permission.update(sdk.Role.any()), 
                sdk.Permission.delete(sdk.Role.users()), 
            ]);
            console.log('Collection created.');
        } catch(e) { console.log('Collection might exist:', e.message); }

        console.log('Creating attributes...');
        const createAttr = async (fn) => { try { await fn(); } catch(e) { console.log('Attr might exist:', e.message); } };
        
        await createAttr(() => databases.createStringAttribute(DB_ID, ORDERS_COL_ID, 'sessionId', 255, true));
        await createAttr(() => databases.createStringAttribute(DB_ID, ORDERS_COL_ID, 'customerName', 255, true));
        await createAttr(() => databases.createStringAttribute(DB_ID, ORDERS_COL_ID, 'customerEmail', 255, true));
        await createAttr(() => databases.createIntegerAttribute(DB_ID, ORDERS_COL_ID, 'amountTotal', true));
        await createAttr(() => databases.createStringAttribute(DB_ID, ORDERS_COL_ID, 'shippingAddress', 2000, true));
        await createAttr(() => databases.createStringAttribute(DB_ID, ORDERS_COL_ID, 'products', 5000, true));
        await createAttr(() => databases.createStringAttribute(DB_ID, ORDERS_COL_ID, 'status', 255, true));
        
        console.log('Attributes created/initiated. Wait a few seconds for Appwrite to process them.');

        console.log('Setup finished successfully!');
    } catch(error) {
        console.error('Setup failed', error);
    }
}

setupOrders();
