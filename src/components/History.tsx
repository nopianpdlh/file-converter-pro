import React from "react";
import { useAppStore } from "../store/useAppStore";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const History: React.FC = () => {
  const { history, clearHistory } = useAppStore();

  return (
    <div className="w-full max-w-2xl p-6 mt-6 bg-slate-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">Riwayat Konversi</h2>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm text-slate-400 hover:text-red-500 underline"
          >
            Bersihkan Riwayat
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center text-slate-500 py-8">
          <p>Belum ada riwayat konversi.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {history.map((item) => (
            <li
              key={item.id}
              className="bg-slate-700 p-3 rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-white truncate max-w-xs">
                  {item.fileName}
                </p>
                <p className="text-sm text-slate-400">
                  {item.fromFormat.toUpperCase()} &rarr;{" "}
                  {item.toFormat.toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white">
                  {formatFileSize(item.fileSize)}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
