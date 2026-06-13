"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!preview) return;

    setLoading(true);
    setResult(null);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: preview }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setResult("Error: " + data.error);
    } else {
      setResult(data.result); // base64 image
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          AI Picture Book Maker
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Upload a photo and turn it into a picture-book style illustration.
        </p>

        {/* 画像アップロード */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-4"
        />

        {/* プレビュー */}
        {preview && (
          <div className="mt-6">
            <p className="text-zinc-600 dark:text-zinc-400 mb-2">Preview:</p>
            <Image
              src={preview}
              alt="preview"
              width={300}
              height={300}
              className="rounded-lg border"
            />
          </div>
        )}

        {/* 生成ボタン */}
        {preview && (
          <button
            onClick={handleGenerate}
            className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-zinc-800"
          >
            {loading ? "Generating..." : "Generate Picture Book Style"}
          </button>
        )}

        {/* 結果表示 */}
        {result && (
          <div className="mt-8">
            <p className="text-zinc-600 dark:text-zinc-400 mb-2">
              Generated Image:
            </p>
            <Image
              src={result}
              alt="generated"
              width={300}
              height={300}
              className="rounded-lg border"
            />
          </div>
        )}
      </main>
    </div>
  );
}
