export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxWidth?: number; // for images
  maxHeight?: number; // for images
}

export const validateFile = async (
  file: File,
  options: FileValidationOptions = {}
): Promise<FileValidationResult> => {
  const {
    maxSize = 500 * 1024 * 1024, // 500MB default
    allowedTypes = [
      "image/*",
      "video/*",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File terlalu besar. Maksimal ${formatFileSize(maxSize)}`,
    };
  }

  // Check file type
  const isTypeAllowed = allowedTypes.some((type) => {
    if (type.endsWith("/*")) {
      return file.type.startsWith(type.slice(0, -1));
    }
    return file.type === type;
  });

  if (!isTypeAllowed) {
    return {
      isValid: false,
      error: "Tipe file tidak didukung",
    };
  }

  // For images, check dimensions if specified
  if (
    file.type.startsWith("image/") &&
    (options.maxWidth || options.maxHeight)
  ) {
    try {
      const dimensions = await getImageDimensions(file);
      if (options.maxWidth && dimensions.width > options.maxWidth) {
        return {
          isValid: false,
          error: `Lebar gambar terlalu besar. Maksimal ${options.maxWidth}px`,
        };
      }
      if (options.maxHeight && dimensions.height > options.maxHeight) {
        return {
          isValid: false,
          error: `Tinggi gambar terlalu besar. Maksimal ${options.maxHeight}px`,
        };
      }
    } catch (error) {
      return {
        isValid: false,
        error: "Gagal membaca dimensi gambar",
      };
    }
  }

  return { isValid: true };
};

export const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  const iconMap: Record<string, string> = {
    // Images
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    webp: "🖼️",
    svg: "🖼️",
    // Videos
    mp4: "🎥",
    avi: "🎥",
    mov: "🎥",
    webm: "🎥",
    mkv: "🎥",
    // Documents
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    txt: "📄",
    // Audio
    mp3: "🎵",
    wav: "🎵",
    ogg: "🎵",
  };

  return iconMap[extension || ""] || "📁";
};
