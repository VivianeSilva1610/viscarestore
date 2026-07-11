import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { adminDatabases, DB_ID, PRODUCTS_COL_ID } from "@/lib/appwrite-admin";
import { searchShopifyProducts } from "@/lib/shopify";

export const dynamic = "force-dynamic";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "6a391020001d02651b57";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "viscareelojavirtual1610";

function imageUrl(imageId: string) {
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${imageId}/view?project=${PROJECT_ID}`;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const locale = req.cookies.get("viscaree_lang")?.value ?? "it";

  if (q.length < 2) {
    return NextResponse.json({ appwrite: [], shopify: [] });
  }

  const [appwriteRes, shopifyProducts] = await Promise.all([
    adminDatabases.listDocuments(DB_ID, PRODUCTS_COL_ID, [
      Query.equal("status", "published"),
      Query.limit(100),
    ]),
    searchShopifyProducts(q, locale),
  ]);

  const ql = q.toLowerCase();
  const appwrite = appwriteRes.documents
    .filter((doc: any) =>
      (doc.name_pt || "").toLowerCase().includes(ql) ||
      (doc.name_it || "").toLowerCase().includes(ql) ||
      (doc.description_pt || "").toLowerCase().includes(ql) ||
      (doc.description_it || "").toLowerCase().includes(ql)
    )
    .map((doc: any) => ({
      id: doc.$id,
      name: locale === "it" ? (doc.name_it || doc.name_pt) : doc.name_pt,
      price: doc.price ?? 0,
      image: doc.image_id ? imageUrl(doc.image_id) : null,
      category: doc.category ?? "",
    }));

  return NextResponse.json({ appwrite, shopify: shopifyProducts });
}
