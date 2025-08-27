import React, { useCallback, useRef, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { useToast } from "../contexts/ToastContext";
import { validateFile } from "../utils/fileValidation";
import { scanFileForSecurity } from "../utils/security";
import { analytics } from "../utils/analytics";
import { LoadingSpinner } from "./Loading";

const FileUploader: React.FC = () => {
  const { setUploadedFile } = useAppStore();
  const { addToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      setIsValidating(true);

      try {
        // File validation
        const validation = await validateFile(file, {
          maxSize: 500 * 1024 * 1024, // 500MB
          allowedTypes: [
            "image/*",
            "video/*",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
        });

        if (!validation.isValid) {
          addToast({
            type: "error",
            message: validation.error || "File tidak valid",
          });
          setIsValidating(false);
          return;
        }

        // Security scan
        const securityScan = await scanFileForSecurity(file);

        if (!securityScan.safe) {
          if (securityScan.risk === "high") {
            addToast({
              type: "error",
              message: "File terdeteksi berbahaya dan tidak bisa diproses",
            });
            setIsValidating(false);
            return;
          } else if (securityScan.risk === "medium") {
            addToast({
              type: "warning",
              message: `Peringatan: ${securityScan.warnings.join(", ")}`,
            });
          }
        }

        // Track file upload
        analytics.trackFileUpload(file.type, file.size);

        setUploadedFile(file);
        addToast({
          type: "success",
          message: `File "${file.name}" berhasil dimuat`,
        });
      } catch (error) {
        console.error("Error validating file:", error);
        addToast({
          type: "error",
          message: "Terjadi kesalahan saat memvalidasi file",
        });
        analytics.trackError("file_validation_error");
      } finally {
        setIsValidating(false);
      }
    },
    [setUploadedFile, addToast]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
      handleFileSelect(event.dataTransfer.files);
    },
    [handleFileSelect]
  );

  return (
    <div
      className={`w-full max-w-2xl p-8 mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border-2 border-dashed transition-all duration-200 cursor-pointer ${
        isDragOver
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105"
          : "border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
      } ${isValidating ? "pointer-events-none" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !isValidating && inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        accept="image/*,video/*,.pdf,.doc,.docx"
      />

      <div className="flex flex-col items-center justify-center text-center">
        {isValidating ? (
          <>
            <LoadingSpinner size="lg" color="text-blue-500" />
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Memvalidasi file...
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mb-4 text-gray-400 dark:text-slate-500">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Seret & Lepas file Anda di sini
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              atau
            </p>

            <span className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Pilih File</span>
            </span>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>Mendukung: Gambar, Video, PDF, DOC/DOCX</p>
              <p>Maksimal: 500MB</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
