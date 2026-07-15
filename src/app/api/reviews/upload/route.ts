import { NextRequest, NextResponse } from "next/server";
import { ID, InputFile, Permission, Role } from "node-appwrite";
import { adminStorage, BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/appwrite-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files.slice(0, 5)) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const inputFile = InputFile.fromBuffer(buffer, file.name || "image.jpg");
      const fileId = ID.unique();
      await adminStorage.createFile(BUCKET_ID, fileId, inputFile, [
        Permission.read(Role.any()),
      ]);
      urls.push(`${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`);
    }

    return NextResponse.json({ urls });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
