import React from "react";
import { useAppStore } from "../store/useAppStore";

// Fungsi helper untuk memformat ukuran file
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const FilePreview: React.FC = () => {
  const { uploadedFile, setUploadedFile } = useAppStore();

  if (!uploadedFile) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl p-6 mt-6 bg-slate-800 rounded-lg shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Icon file sederhana */}
        <svg
          className="w-10 h-10 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div>
          <p className="text-white font-semibold truncate max-w-xs">
            {uploadedFile.name}
          </p>
          <p className="text-slate-400 text-sm">
            {formatFileSize(uploadedFile.size)}
          </p>
        </div>
      </div>
      <button
        onClick={() => setUploadedFile(null)}
        className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full"
        title="Hapus file"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default FilePreview;
