// /app/api/generateSignature/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY) {
    return new Response("Cloudinary API Key is missing", { status: 500 });
  }

  const paramsToSign = await req.json();
  if (!paramsToSign)
    return new Response("No parameters to sign", { status: 400 });

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET ?? ""
  );

  return NextResponse.json({ signature });
}
