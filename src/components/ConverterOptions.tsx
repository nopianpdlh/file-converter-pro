import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { useToast } from "../contexts/ToastContext";
import { convertFile } from "../utils/converters";
import { analytics } from "../utils/analytics";

const formatOptions = {
  image: ["png", "jpg", "webp", "gif"],
  video: ["mp4", "mov", "avi", "webm"],
  // document: ['pdf', 'docx', 'txt'], // Kita nonaktifkan sementara
};

const ConverterOptions: React.FC = () => {
  const {
    uploadedFile,
    outputFormat,
    setOutputFormat,
    setIsConverting,
    setConversionProgress,
    setConvertedFileUrl,
    addHistoryItem,
  } = useAppStore();

  const { addToast } = useToast();
  const [key, setKey] = useState<keyof typeof formatOptions | null>(null);

  useEffect(() => {
    if (uploadedFile) {
      const type = uploadedFile.type.split("/")[0];
      if (type === "image" || type === "video") {
        setKey(type as keyof typeof formatOptions);
        setOutputFormat(formatOptions[type as keyof typeof formatOptions][0]);
      } else {
        setKey(null);
      }
    }
  }, [uploadedFile, setOutputFormat]);

  const handleConvert = async () => {
    if (!uploadedFile || !outputFormat) return;

    const startTime = Date.now();
    setIsConverting(true);
    setConversionProgress(0);

    try {
      const resultBlob = await convertFile(uploadedFile, outputFormat);
      const url = URL.createObjectURL(resultBlob);
      const duration = Date.now() - startTime;

      setConvertedFileUrl(url);

      // Track successful conversion
      analytics.trackConversion(
        uploadedFile.name.split(".").pop() || "unknown",
        outputFormat,
        uploadedFile.size,
        duration,
        true
      );

      addHistoryItem({
        fileName: uploadedFile.name,
        fromFormat: uploadedFile.name.split(".").pop() || "unknown",
        toFormat: outputFormat,
        fileSize: uploadedFile.size,
      });

      addToast({
        type: "success",
        message: `File berhasil dikonversi ke ${outputFormat.toUpperCase()}!`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error selama konversi:", error);
      const duration = Date.now() - startTime;

      // Track failed conversion
      analytics.trackConversion(
        uploadedFile.name.split(".").pop() || "unknown",
        outputFormat,
        uploadedFile.size,
        duration,
        false
      );

      analytics.trackError("conversion_failed");

      addToast({
        type: "error",
        message: "Terjadi kesalahan saat mengonversi file. Silakan coba lagi.",
        duration: 7000,
      });
    } finally {
      setIsConverting(false);
    }
  };

  if (!key) {
    return (
      <div className="w-full max-w-2xl p-6 mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg shadow-lg text-center">
        <div className="flex items-center justify-center mb-2">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="font-semibold">Tipe File Tidak Didukung</span>
        </div>
        <p className="text-sm">
          File ini tidak dapat dikonversi. Silakan pilih file gambar atau video.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl p-6 mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg transition-colors">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label
            htmlFor="format"
            className="text-gray-700 dark:text-gray-300 font-medium"
          >
            Konversi ke:
          </label>
          <select
            id="format"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white rounded-md p-3 border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
          >
            {formatOptions[key].map((format) => (
              <option key={format} value={format}>
                {format.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleConvert}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          disabled={!uploadedFile || !outputFormat}
        >
          <span className="flex items-center justify-center space-x-2">
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
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>Konversi Sekarang</span>
          </span>
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Konversi dilakukan secara lokal di browser Anda untuk menjaga privasi
          file.
        </p>
      </div>
    </div>
  );
};

export default ConverterOptions;
