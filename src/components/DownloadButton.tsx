import React from "react";
import { useAppStore } from "../store/useAppStore";

const DownloadButton: React.FC = () => {
  const { convertedFileUrl, outputFormat, resetState } = useAppStore();

  if (!convertedFileUrl) return null;

  return (
    <div className="w-full max-w-2xl p-6 mt-6 bg-slate-800 rounded-lg shadow-lg flex flex-col items-center gap-6">
      <h3 className="text-2xl font-bold text-green-400">Konversi Berhasil!</h3>
      <a
        href={convertedFileUrl}
        download={`hasil-konversi.${outputFormat}`}
        className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 text-center"
      >
        Unduh File
      </a>
      <button
        onClick={resetState}
        className="text-slate-400 hover:text-white underline"
      >
        Konversi File Lain
      </button>
    </div>
  );
};

export default DownloadButton;
