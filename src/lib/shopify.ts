const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN ?? "";
const API_URL = "https://viscare-2.myshopify.com/api/2026-04/graphql.json";
const SHOP_URL = "https://viscare-2.myshopify.com";

export { SHOP_URL };

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
  handle: string;
  title: string;
  description: string;
  featuredImage: ShopifyImage | null;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  variants: {
    edges: Array<{ node: { id: string } }>;
  };
}

export interface ShopifyCollection {
  title: string;
  description: string;
  products: {
    edges: Array<{ node: ShopifyProduct }>;
  };
}

// Maps VisCaree locale codes to Shopify LanguageCode enum values
const SHOPIFY_LANG: Record<string, string> = {
  pt: "PT",
  it: "IT",
};

const COLLECTION_QUERY = `
  query CollectionByHandle($handle: String!, $language: LanguageCode!)
  @inContext(language: $language) {
    collectionByHandle(handle: $handle) {
      title
      description
      products(first: 50) {
        edges {
          node {
            id
            handle
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
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchShopifyCollection(
  handle: string,
  locale = "it"
): Promise<ShopifyCollection | null> {
  if (!STOREFRONT_TOKEN) return null;

  const language = SHOPIFY_LANG[locale] ?? "IT";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query: COLLECTION_QUERY, variables: { handle, language } }),
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json.data?.collectionByHandle ?? null;
}
