const sdk = require('node-appwrite');

const client = new sdk.Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('viscareelojavirtual1610')
    .setKey('standard_d15b590d7c652335d8f3e3ead9d67980def6dfafc3edbfbc94a785171335b10a82ab6f625fe99244cf039a279694964eae3fcdd708c19d03cdddfae448b9e20f39fec2489eb8c859d224817a3f2c2f2f8c74520dfa1b80fb8508fba7ce3c9365a50f3c2c96f81bdb7379eaf996438af29df7baeb1a98462dcb254950762c55a8');

const databases = new sdk.Databases(client);
const DB_ID = '6a390e430024feb8df57';
const COLLECTION_ID = 'products';

function generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function getPrefix(category) {
    if (!category) return 'PROD';
    let clean = category.replace(/[^A-Za-z0-9]/g, '');
    if (clean.length === 0) return 'PROD';
    return clean.substring(0, 3).toUpperCase();
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    try {
        console.log('1. Verificando/Criando atributo productCode...');
        try {
            await databases.createStringAttribute(DB_ID, COLLECTION_ID, 'productCode', 50, false);
            console.log('Atributo productCode criado com sucesso. Aguardando processamento...');
            await sleep(5000);
        } catch (e) {
            console.log('Atributo possivelmente já existe:', e.message);
        }

        console.log('2. Buscando todos os produtos...');
        const limit = 100;
        let offset = 0;
        let allProducts = [];
        let hasMore = true;

        while (hasMore) {
            const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
                sdk.Query.limit(limit),
                sdk.Query.offset(offset)
            ]);
            allProducts = allProducts.concat(res.documents);
            if (res.documents.length < limit) {
                hasMore = false;
            } else {
                offset += limit;
            }
        }

        console.log(`Encontrados ${allProducts.length} produtos.`);

        console.log('3. Agrupando por nome...');
        const groups = {};
        for (const product of allProducts) {
            const name = (product.name_pt || '').trim().toLowerCase();
            if (!groups[name]) groups[name] = [];
            groups[name].push(product);
        }

        console.log(`Encontrados ${Object.keys(groups).length} nomes únicos de produtos.`);

        console.log('4. Atualizando códigos dos produtos...');
        for (const name in groups) {
            const productsInGroup = groups[name];
            
            // Verifica se algum produto no grupo já tem código
            let existingCode = null;
            for (const p of productsInGroup) {
                if (p.productCode) {
                    existingCode = p.productCode;
                    break;
                }
            }

            // Se nenhum tiver código, gera um
            if (!existingCode) {
                const category = productsInGroup[0].category;
                const prefix = getPrefix(category);
                
                // Garante que o código seja único entre todos os produtos no BD (simples verificação de loop)
                let isUnique = false;
                while (!isUnique) {
                    existingCode = `${prefix}-${generateRandomCode()}`;
                    isUnique = true;
                    // Verifica nos arquivos da memória (allProducts) se já existe para evitar colisão imediata
                    for (const p of allProducts) {
                        if (p.productCode === existingCode) {
                            isUnique = false;
                            break;
                        }
                    }
                }
            }

            // Atualiza todos os produtos do grupo com o código
            for (const product of productsInGroup) {
                if (product.productCode !== existingCode) {
                    try {
                        await databases.updateDocument(DB_ID, COLLECTION_ID, product.$id, {
                            productCode: existingCode
                        });
                        console.log(`Atualizado ${product.name_pt} (ID: ${product.$id}) -> ${existingCode}`);
                    } catch (e) {
                        console.error(`Erro ao atualizar ${product.$id}:`, e.message);
                    }
                }
            }
        }

        console.log('Migração concluída com sucesso!');

    } catch (error) {
        console.error('Erro na migração:', error);
    }
}

run();
