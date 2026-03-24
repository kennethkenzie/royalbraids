"use client";

import { useMemo, useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";

type CategoryCircleImageFieldProps = {
  defaultValue?: string;
  previewColor?: string;
};

export default function CategoryCircleImageField({
  defaultValue = "",
  previewColor = "#944a95",
}: CategoryCircleImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");
  const [previewError, setPreviewError] = useState("");

  const previewUrl = useMemo(() => imageUrl.trim(), [imageUrl]);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!cloudName || !uploadPreset) {
      setError(
        "Cloudinary upload is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
      );
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: payload,
        }
      );

      const data = await response.json();
      if (!response.ok || !data.secure_url) {
        throw new Error(data?.error?.message || "Image upload failed.");
      }

      setImageUrl(data.secure_url);
      setImageName(file.name);
      setPreviewError("");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name="circleImage" value={imageUrl} />
      <div className="grid gap-4 md:grid-cols-[1fr_170px]">
        <div>
          <label
            htmlFor="circleImage"
            className="mb-2 block text-[13px] font-medium text-zinc-700"
          >
            Circle Image URL
          </label>
          <input
            type="url"
            id="circleImage"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setError("");
              setPreviewError("");
            }}
            placeholder="https://res.cloudinary.com/..."
            className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
          />
          <p className="mt-1 text-[11px] text-zinc-400">
            Paste a Cloudinary or direct image URL
          </p>
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-medium text-zinc-700">
            Upload Circle Image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleImageSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-[13px] font-medium text-black transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <Upload className="h-4 w-4" />
                Uploading...
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" />
                Upload Image
              </>
            )}
          </button>
          <p className="mt-1 text-[11px] text-zinc-400">PNG, JPG, WEBP up to 5MB</p>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[12px] text-red-600">
          {error}
        </p>
      )}

      {previewUrl && (
        <div className="overflow-hidden rounded-xl border border-zinc-100">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-2">
            <p className="text-[11px] font-medium text-zinc-500">
              {imageName || "Circle Image preview"}
            </p>
            <button
              type="button"
              onClick={() => {
                setImageUrl("");
                setImageName("");
                setError("");
                setPreviewError("");
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition hover:text-black"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          </div>
          {previewError ? (
            <div className="flex h-[180px] items-center justify-center bg-zinc-50 px-4 text-center text-[12px] text-red-500">
              {previewError}
            </div>
          ) : (
            <div className="flex items-center justify-center p-4 bg-zinc-50">
              <div
                className="flex h-[150px] w-[150px] items-end justify-center overflow-hidden rounded-full"
                style={{ backgroundColor: previewColor }}
              >
                <img
                  key={previewUrl}
                  src={previewUrl}
                  alt="Category circle preview"
                  className="h-[120%] w-auto object-contain"
                  onError={() => {
                    setPreviewError("Image preview could not be loaded. Check the image URL.");
                  }}
                  onLoad={() => {
                    setPreviewError("");
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
