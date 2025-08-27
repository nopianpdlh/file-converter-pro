import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useAppStore } from "../store/useAppStore";

// Fungsi untuk konversi video menggunakan FFmpeg
const convertVideo = async (
  ffmpeg: FFmpeg,
  file: File,
  outputFormat: string
): Promise<Blob> => {
  const { setConversionProgress } = useAppStore.getState();
  const inputFileName = `input.${file.name.split(".").pop()}`;
  const outputFileName = `output.${outputFormat}`;

  ffmpeg.on("progress", ({ progress }) => {
    setConversionProgress(progress * 100);
  });

  await ffmpeg.writeFile(inputFileName, await fetchFile(file));
  await ffmpeg.exec(["-i", inputFileName, outputFileName]);
  const data = await ffmpeg.readFile(outputFileName);

  // PERBAIKAN: Konversi FileData ke compatible format untuk Blob
  const uint8Array = data as Uint8Array;
  const buffer = new ArrayBuffer(uint8Array.length);
  new Uint8Array(buffer).set(uint8Array);
  return new Blob([buffer], { type: `video/${outputFormat}` });
};

// Fungsi untuk konversi gambar menggunakan Canvas API
const convertImage = (file: File, outputFormat: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Tidak bisa mendapatkan konteks canvas"));
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Gagal membuat blob dari canvas"));
            }
          },
          `image/${outputFormat}`,
          0.95 // Kualitas untuk format seperti JPG/WEBP
        );
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Fungsi utama yang akan dipanggil oleh UI
export const convertFile = async (
  file: File,
  outputFormat: string
): Promise<Blob> => {
  const fileType = file.type.split("/")[0];

  if (fileType === "video") {
    const ffmpeg = new FFmpeg();
    const baseURL = "/ffmpeg"; // Path ke folder public/ffmpeg
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
    return convertVideo(ffmpeg, file, outputFormat);
  } else if (fileType === "image") {
    return convertImage(file, outputFormat);
  } else {
    // TODO: Tambahkan logika konversi dokumen di sini
    throw new Error("Tipe file ini belum didukung untuk konversi.");
  }
};
