"use client";

import ReportUploadForm from "../components/ReportUploadForm";

export default function VideoUploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* <VideoUploadForm /> */}
        <h1 className="text-3xl font-bold mb-8">Upload New Doc</h1>
        <ReportUploadForm />
      </div>
    </div>
  );
}