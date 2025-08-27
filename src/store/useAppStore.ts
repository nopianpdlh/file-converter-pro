import { create } from "zustand";
import type { HistoryItem } from "../types";

const HISTORY_KEY = "fileConverterHistory";

interface AppState {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  outputFormat: string;
  setOutputFormat: (format: string) => void;
  isConverting: boolean;
  setIsConverting: (status: boolean) => void;
  conversionProgress: number;
  setConversionProgress: (progress: number) => void;
  convertedFileUrl: string | null;
  setConvertedFileUrl: (url: string | null) => void;
  resetState: () => void;

  // State dan fungsi baru untuk riwayat
  history: HistoryItem[];
  loadHistory: () => void;
  addHistoryItem: (item: Omit<HistoryItem, "id" | "date">) => void;
  clearHistory: () => void;
}

const initialState = {
  uploadedFile: null,
  outputFormat: "",
  isConverting: false,
  conversionProgress: 0,
  convertedFileUrl: null,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  history: [],
  setUploadedFile: (file) => set({ ...initialState, uploadedFile: file }),
  setOutputFormat: (format) => set({ outputFormat: format }),
  setIsConverting: (status) => set({ isConverting: status }),
  setConversionProgress: (progress) => set({ conversionProgress: progress }),
  setConvertedFileUrl: (url) => set({ convertedFileUrl: url }),
  resetState: () => set(initialState),

  loadHistory: () => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        set({ history: JSON.parse(storedHistory) });
      }
    } catch (error) {
      console.error("Gagal memuat riwayat:", error);
      set({ history: [] });
    }
  },
  addHistoryItem: (item) => {
    set((state) => {
      const newItem: HistoryItem = {
        ...item,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };
      // Batasi riwayat hingga 10 entri terbaru
      const updatedHistory = [newItem, ...state.history].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      return { history: updatedHistory };
    });
  },
  clearHistory: () => {
    localStorage.removeItem(HISTORY_KEY);
    set({ history: [] });
  },
}));
