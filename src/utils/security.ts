export interface SecurityScanResult {
  safe: boolean;
  warnings: string[];
  risk: "low" | "medium" | "high";
}

export const scanFileForSecurity = async (
  file: File
): Promise<SecurityScanResult> => {
  const warnings: string[] = [];
  let risk: "low" | "medium" | "high" = "low";

  // Check file extension vs MIME type mismatch
  const fileName = file.name.toLowerCase();
  const actualMimeType = file.type;

  if (checkMimeTypeMismatch(fileName, actualMimeType)) {
    warnings.push("File extension tidak sesuai dengan content type");
    risk = "high";
  }

  // Check for suspicious file names
  if (checkSuspiciousFileName(fileName)) {
    warnings.push("Nama file terdeteksi mencurigakan");
    risk = "medium";
  }

  // Check file size anomalies
  if (checkFileSizeAnomaly(file)) {
    warnings.push("Ukuran file tidak normal untuk tipe ini");
    risk = "medium";
  }

  // Scan for embedded executables (basic check)
  const hasEmbeddedExecutable = await scanForEmbeddedExecutables(file);
  if (hasEmbeddedExecutable) {
    warnings.push("Terdeteksi kemungkinan executable tersembunyi");
    risk = "high";
  }

  return {
    safe: risk === "low" && warnings.length === 0,
    warnings,
    risk,
  };
};

const checkMimeTypeMismatch = (fileName: string, mimeType: string): boolean => {
  const extensionMimeMap: Record<string, string[]> = {
    ".jpg": ["image/jpeg"],
    ".jpeg": ["image/jpeg"],
    ".png": ["image/png"],
    ".gif": ["image/gif"],
    ".webp": ["image/webp"],
    ".mp4": ["video/mp4"],
    ".avi": ["video/x-msvideo"],
    ".mov": ["video/quicktime"],
    ".pdf": ["application/pdf"],
    ".doc": ["application/msword"],
    ".docx": [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  };

  const extension = fileName.substring(fileName.lastIndexOf("."));
  const expectedMimes = extensionMimeMap[extension];

  if (expectedMimes && !expectedMimes.includes(mimeType)) {
    return true;
  }

  return false;
};

const checkSuspiciousFileName = (fileName: string): boolean => {
  const suspiciousPatterns = [
    /\.exe$/i,
    /\.scr$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.com$/i,
    /\.pif$/i,
    /\.vbs$/i,
    /\.js$/i,
    /\.jar$/i,
    /\.zip$/i,
    /\.rar$/i,
    /\.(php|asp|jsp)$/i,
    /^con\./i,
    /^prn\./i,
    /^aux\./i,
    /^nul\./i,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(fileName));
};

const checkFileSizeAnomaly = (file: File): boolean => {
  const { size, type } = file;

  // Suspicious if file is too small for its claimed type
  if (type.startsWith("video/") && size < 1000) {
    return true;
  }

  if (type.startsWith("image/") && size < 100) {
    return true;
  }

  // Suspicious if file is extremely large
  if (size > 2 * 1024 * 1024 * 1024) {
    // 2GB
    return true;
  }

  return false;
};

const scanForEmbeddedExecutables = async (file: File): Promise<boolean> => {
  // Read first few KB to check for executable signatures
  const chunk = file.slice(0, 8192);
  const arrayBuffer = await chunk.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Check for common executable signatures
  const executableSignatures = [
    [0x4d, 0x5a], // PE executable (MZ)
    [0x7f, 0x45, 0x4c, 0x46], // ELF executable
    [0xca, 0xfe, 0xba, 0xbe], // Mach-O executable
    [0x50, 0x4b, 0x03, 0x04], // ZIP (could contain executables)
  ];

  for (const signature of executableSignatures) {
    if (bytes.length >= signature.length) {
      let match = true;
      for (let i = 0; i < signature.length; i++) {
        if (bytes[i] !== signature[i]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
  }

  return false;
};

export const sanitizeFileName = (fileName: string): string => {
  // Remove dangerous characters and normalize
  return fileName
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase()
    .substring(0, 255); // Limit length
};
