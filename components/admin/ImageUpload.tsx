"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, Link as LinkIcon, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  /** Accent color for focus ring / buttons. Default: emerald */
  accent?: "emerald" | "violet" | "blue";
  placeholder?: string;
  label?: string;
  hint?: string;
  /** Show a preview of the current image */
  showPreview?: boolean;
  className?: string;
}

const ACCENT = {
  emerald: {
    ring: "focus:ring-emerald-500/20 focus:border-emerald-500",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    btnLight: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    active: "border-emerald-300 bg-emerald-50",
  },
  violet: {
    ring: "focus:ring-violet-500/20 focus:border-violet-500",
    btn: "bg-violet-600 hover:bg-violet-700",
    btnLight: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
    active: "border-violet-300 bg-violet-50",
  },
  blue: {
    ring: "focus:ring-blue-500/20 focus:border-blue-500",
    btn: "bg-blue-600 hover:bg-blue-700",
    btnLight: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    active: "border-blue-300 bg-blue-50",
  },
};

export default function ImageUpload({
  value,
  onChange,
  accent = "emerald",
  placeholder = "https://example.com/image.jpg",
  label,
  hint,
  showPreview = true,
  className = "",
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const colors = ACCENT[accent];

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length === 0) return;

      setUploading(true);
      try {
        const formData = new FormData();
        // Upload only the first file for single-image mode
        formData.append("files", imageFiles[0]);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          if (data.files && data.files.length > 0) {
            onChange(data.files[0].url);
          }
        }
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.length) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [uploadFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
      )}

      {/* Mode Toggle */}
      <div className="flex gap-1 p-0.5 bg-gray-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === "upload"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === "url"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          URL
        </button>
      </div>

      {mode === "upload" ? (
        /* ── Drag & Drop / File Picker ── */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            dragActive
              ? colors.active
              : uploading
              ? "border-gray-200 bg-gray-50 cursor-wait"
              : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) {
                uploadFiles(e.target.files);
                e.target.value = "";
              }
            }}
          />

          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              <p className="text-sm text-gray-500 font-medium">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  <span className={`text-${accent}-600 font-semibold`}>Click to upload</span> or
                  drag & drop
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  PNG, JPG, GIF, WebP up to 10MB
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        /* ── URL Input ── */
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm ${colors.ring} outline-none transition-all`}
        />
      )}

      {hint && <p className="text-xs text-gray-400">{hint}</p>}

      {/* Preview */}
      {showPreview && value && (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-[10px] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ImageIcon className="w-3 h-3" />
            {value.startsWith("/uploads/") ? "Local file" : "External URL"}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Multi-file upload variant ── */
interface MultiImageUploadProps {
  onUpload: (urls: string[]) => void;
  accent?: "emerald" | "violet" | "blue";
  className?: string;
}

export function MultiImageUpload({
  onUpload,
  accent = "violet",
  className = "",
}: MultiImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const colors = ACCENT[accent];

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length === 0) return;

      setUploading(true);
      try {
        const formData = new FormData();
        imageFiles.forEach((f) => formData.append("files", f));

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          if (data.files && data.files.length > 0) {
            onUpload(data.files.map((f: { url: string }) => f.url));
          }
        }
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.length) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [uploadFiles]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
      onClick={() => !uploading && fileInputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
        dragActive
          ? colors.active
          : uploading
          ? "border-gray-200 bg-gray-50 cursor-wait"
          : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50"
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            uploadFiles(e.target.files);
            e.target.value = "";
          }
        }}
      />

      {uploading ? (
        <>
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Uploading images...</p>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              <span className={`text-${accent}-600 font-semibold`}>Click to upload</span> or drag
              & drop
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Select multiple images · PNG, JPG, GIF, WebP up to 10MB each
            </p>
          </div>
        </>
      )}
    </div>
  );
}
