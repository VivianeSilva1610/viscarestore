const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN ?? "";
const API_URL = "https://viscare-2.myshopify.com/api/2026-04/graphql.json";

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  featuredImage: ShopifyImage | null;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
}

export interface ShopifyCollection {
  title: string;
  description: string;
  products: {
    edges: Array<{ node: ShopifyProduct }>;
  };
}

const COLLECTION_QUERY = `
  query CollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      title
      description
      products(first: 50) {
        edges {
          node {
            id
            title
            description
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchShopifyCollection(
  handle: string
): Promise<ShopifyCollection | null> {
  if (!STOREFRONT_TOKEN) return null;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query: COLLECTION_QUERY, variables: { handle } }),
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json.data?.collectionByHandle ?? null;
}
