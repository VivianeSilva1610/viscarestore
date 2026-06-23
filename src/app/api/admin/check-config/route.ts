import { NextResponse } from "next/server";

export async function GET() {
  const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "";
  const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
  const appwriteDatabaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6a390e430024feb8df57";
  const appwriteBucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "6a391020001d02651b57";

  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

  return NextResponse.json({
    appwrite: {
      configured: !!appwriteProjectId,
      endpoint: appwriteEndpoint,
      projectId: appwriteProjectId ? `${appwriteProjectId.substring(0, 4)}...${appwriteProjectId.substring(appwriteProjectId.length - 4)}` : "",
      databaseId: appwriteDatabaseId ? `${appwriteDatabaseId.substring(0, 4)}...${appwriteDatabaseId.substring(appwriteDatabaseId.length - 4)}` : "",
      bucketId: appwriteBucketId ? `${appwriteBucketId.substring(0, 4)}...${appwriteBucketId.substring(appwriteBucketId.length - 4)}` : "",
    },
    stripe: {
      configured: !!stripePublishableKey && !!stripeSecretKey,
      hasPublishableKey: !!stripePublishableKey,
      hasSecretKey: !!stripeSecretKey,
      publishableKey: stripePublishableKey ? `${stripePublishableKey.substring(0, 8)}...${stripePublishableKey.substring(stripePublishableKey.length - 4)}` : "",
    },
  });
}
