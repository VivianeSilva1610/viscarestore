import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export const dynamic = "force-dynamic";

const ENDPOINT  = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT  || "https://fra.cloud.appwrite.io/v1";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "viscareelojavirtual1610";
const BUCKET_ID  = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID  || "6a391020001d02651b57";
const API_KEY    = process.env.APPWRITE_API_KEY as string;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files.slice(0, 5)) {
      const fileId = ID.unique();

      // Build multipart body for the Appwrite REST API
      const body = new FormData();
      body.append("fileId", fileId);
      body.append("file", file, file.name || "image.jpg");
      // Grant public read permission so anyone can view the image
      body.append("permissions[]", 'read("any")');

      const res = await fetch(
        `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files`,
        {
          method: "POST",
          headers: {
            "X-Appwrite-Project": PROJECT_ID,
            "X-Appwrite-Key":     API_KEY,
          },
          body,
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("[reviews/upload] Appwrite error:", err);
        continue;
      }

      urls.push(`${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`);
    }

    return NextResponse.json({ urls });
  } catch (e: any) {
    console.error("[reviews/upload] erro:", e?.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
