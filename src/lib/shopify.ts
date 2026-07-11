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
  productType: string;
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
            productType
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

export interface ShopifyProductDetail extends ShopifyProduct {
  descriptionHtml: string;
  images: { edges: Array<{ node: ShopifyImage }> };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: ShopifyMoney;
        image: ShopifyImage | null;
      };
    }>;
  };
}

const PRODUCT_QUERY = `
  query ProductByHandle($handle: String!, $language: LanguageCode!)
  @inContext(language: $language) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      featuredImage { url altText }
      images(first: 10) {
        edges { node { url altText } }
      }
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            image { url altText }
          }
        }
      }
    }
  }
`;

export async function fetchShopifyProduct(
  handle: string,
  locale = "it"
): Promise<ShopifyProductDetail | null> {
  if (!STOREFRONT_TOKEN) return null;

  const language = SHOPIFY_LANG[locale] ?? "IT";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query: PRODUCT_QUERY, variables: { handle, language } }),
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.product ?? null;
}

const CREATE_CART_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        checkoutUrl
      }
      userErrors { field message }
    }
  }
`;

export async function createShopifyCart(
  items: { variantId: string; quantity: number }[]
): Promise<{ checkoutUrl: string } | null> {
  if (!STOREFRONT_TOKEN) return null;

  const lines = items.map(({ variantId, quantity }) => ({
    merchandiseId: variantId,
    quantity,
  }));

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query: CREATE_CART_MUTATION, variables: { lines } }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const json = await res.json();
  const checkoutUrl = json.data?.cartCreate?.cart?.checkoutUrl;
  return checkoutUrl ? { checkoutUrl } : null;
}

export interface ShopifySearchResult {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: ShopifyImage | null;
  priceRange: { minVariantPrice: ShopifyMoney };
  collections: { edges: Array<{ node: { title: string; handle: string } }> };
  variants: { edges: Array<{ node: { id: string } }> };
}

const SEARCH_QUERY = `
  query SearchProducts($query: String!, $language: LanguageCode!)
  @inContext(language: $language) {
    search(query: $query, types: PRODUCT, first: 24) {
      edges {
        node {
          ... on Product {
            id
            handle
            title
            description
            featuredImage { url altText }
            priceRange { minVariantPrice { amount currencyCode } }
            collections(first: 3) {
              edges { node { title handle } }
            }
            variants(first: 1) {
              edges { node { id } }
            }
          }
        }
      }
    }
  }
`;

export async function searchShopifyProducts(
  query: string,
  locale = "it"
): Promise<ShopifySearchResult[]> {
  if (!STOREFRONT_TOKEN || !query) return [];
  const language = SHOPIFY_LANG[locale] ?? "IT";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query: SEARCH_QUERY, variables: { query, language } }),
    cache: "no-store",
  });

  if (!res.ok) return [];
  const json = await res.json();
  return (json.data?.search?.edges ?? []).map((e: any) => e.node);
}

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
