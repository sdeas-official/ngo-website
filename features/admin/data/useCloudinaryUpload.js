"use client";

import { useCallback, useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

// Uploads a single file to Cloudinary and resolves to its secure_url.
// Uses XMLHttpRequest so callers can render real upload progress (the legacy
// panel used fetch and could only show an indeterminate "Uploading..." label).
export function uploadToCloudinary(file, { onProgress } = {}) {
  if (!isCloudinaryConfigured) {
    return Promise.reject(
      new Error(
        "Cloudinary config missing. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.",
      ),
    );
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === "function") {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(new Error(data?.error?.message || "Cloudinary upload failed."));
        }
      } catch {
        reject(new Error("Cloudinary upload failed."));
      }
    };

    xhr.onerror = () => reject(new Error("Cloudinary upload failed."));
    xhr.send(formData);
  });
}

// React hook wrapper: tracks per-hook progress + error and exposes upload(file).
export function useCloudinaryUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = useCallback(async (file) => {
    if (!file) return "";
    setError("");
    setIsUploading(true);
    setProgress(0);
    try {
      const url = await uploadToCloudinary(file, { onProgress: setProgress });
      return url;
    } catch (uploadError) {
      setError(uploadError?.message || "Image upload failed.");
      throw uploadError;
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Uploads several files sequentially (used by the gallery manager).
  const uploadMany = useCallback(async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return [];
    setError("");
    setIsUploading(true);
    const urls = [];
    try {
      for (let i = 0; i < list.length; i += 1) {
        setProgress(0);
        const url = await uploadToCloudinary(list[i], { onProgress: setProgress });
        urls.push(url);
      }
      return urls;
    } catch (uploadError) {
      setError(uploadError?.message || "Image upload failed.");
      throw uploadError;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { upload, uploadMany, progress, isUploading, error, isConfigured: isCloudinaryConfigured };
}
