export interface HistoryItem {
  id: string;
  fileName: string;
  fromFormat: string;
  toFormat: string;
  date: string;
  fileSize: number; // Ukuran file asli dalam bytes
}
