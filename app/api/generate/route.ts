import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Cloudflare Worker の URL
    const workerUrl = "https://wandering-brook-ad9a.akatsuka-tanukid.workers.dev/";

    // Worker に画像を送信
    const res = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    // Worker が返した生成画像（base64）
    return NextResponse.json({
      result: data.result, // base64
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
