const { databases, DB_ID } = require('./appwrite-admin-client.cjs');

const ORDERS_COL_ID = 'orders';

async function setupOrdersTracking() {
  const createAttr = async (label, fn) => {
    try {
      await fn();
      console.log(`Criado: ${label}`);
    } catch (e) {
      console.log(`Ignorado (${label}): ${e.message}`);
    }
  };

  await createAttr('trackingCode', () =>
    databases.createStringAttribute(DB_ID, ORDERS_COL_ID, 'trackingCode', 32, false)
  );
  await createAttr('trackingStatus', () =>
    databases.createStringAttribute(DB_ID, ORDERS_COL_ID, 'trackingStatus', 32, false, 'preparando')
  );
  await createAttr('statusHistory', () =>
    databases.createStringAttribute(DB_ID, ORDERS_COL_ID, 'statusHistory', 4000, false)
  );
  await createAttr('estimatedDeliveryDate', () =>
    databases.createStringAttribute(DB_ID, ORDERS_COL_ID, 'estimatedDeliveryDate', 32, false)
  );

  console.log('Setup de tracking em orders finalizado. Aguarde alguns segundos para o Appwrite processar os atributos.');
}

setupOrdersTracking();
