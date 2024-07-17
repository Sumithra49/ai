import UploadForm from "./components/UploadForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-2">
      <h1 className="text-4xl mb-4">AI-Powered Content Summarization Tool</h1>
      <UploadForm/>
    </div>
  );
}
