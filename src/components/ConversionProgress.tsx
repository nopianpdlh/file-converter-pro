import React from "react";
import { useAppStore } from "../store/useAppStore";

const ConversionProgress: React.FC = () => {
  const { isConverting, conversionProgress } = useAppStore();

  if (!isConverting) return null;

  return (
    <div className="w-full max-w-2xl p-6 mt-6 bg-slate-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white text-center mb-4">
        Mengonversi...
      </h3>
      <div className="w-full bg-slate-700 rounded-full h-4">
        <div
          className="bg-sky-600 h-4 rounded-full transition-all duration-150"
          style={{ width: `${conversionProgress}%` }}
        ></div>
      </div>
      <p className="text-center text-slate-400 mt-2">
        {Math.round(conversionProgress)}%
      </p>
    </div>
  );
};

export default ConversionProgress;
