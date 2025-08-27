import Header from "./components/Header";
import FileUploader from "./components/FileUploader";
import ConverterOptions from "./components/ConverterOptions";
import History from "./components/History";
import FilePreview from "./components/FilePreview";
import ConversionProgress from "./components/ConversionProgress";
import DownloadButton from "./components/DownloadButton";
import { ToastContainer } from "./components/Toast";
import { useAppStore } from "./store/useAppStore";
import { useEffect } from "react";

function App() {
  const { uploadedFile, isConverting, convertedFileUrl, loadHistory } =
    useAppStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const showConverterOptions =
    uploadedFile && !isConverting && !convertedFileUrl;

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl flex flex-col items-center gap-6">
        <Header />

        {!uploadedFile ? <FileUploader /> : <FilePreview />}

        {showConverterOptions && <ConverterOptions />}

        {isConverting && <ConversionProgress />}

        {convertedFileUrl && <DownloadButton />}

        <History />
      </div>

      <ToastContainer />
    </div>
  );
}
export default App;
