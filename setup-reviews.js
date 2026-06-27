const { sdk, databases, DB_ID } = require('./appwrite-admin-client.cjs');

const REVIEWS_COL_ID = 'reviews';

async function setupReviews() {
  try {
    await databases.createCollection(DB_ID, REVIEWS_COL_ID, 'Reviews', [
      sdk.Permission.read(sdk.Role.any()),
      sdk.Permission.create(sdk.Role.any()),
    ]);
    console.log('Collection reviews criada.');
  } catch (e) {
    console.log(`Collection pode ja existir: ${e.message}`);
  }

  const createAttr = async (label, fn) => {
    try {
      await fn();
      console.log(`Criado: ${label}`);
    } catch (e) {
      console.log(`Ignorado (${label}): ${e.message}`);
    }
  };

  await createAttr('productId', () =>
    databases.createStringAttribute(DB_ID, REVIEWS_COL_ID, 'productId', 64, true)
  );
  await createAttr('customerName', () =>
    databases.createStringAttribute(DB_ID, REVIEWS_COL_ID, 'customerName', 120, true)
  );
  await createAttr('rating', () =>
    databases.createIntegerAttribute(DB_ID, REVIEWS_COL_ID, 'rating', true, 1, 5)
  );
  await createAttr('comment', () =>
    databases.createStringAttribute(DB_ID, REVIEWS_COL_ID, 'comment', 2000, true)
  );
  await createAttr('approved', () =>
    databases.createBooleanAttribute(DB_ID, REVIEWS_COL_ID, 'approved', false, false)
  );

  console.log('Setup da collection reviews finalizado. Aguarde alguns segundos para o Appwrite processar os atributos.');
}

setupReviews();
