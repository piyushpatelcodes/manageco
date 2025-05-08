"use client";

import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video" | "zip" | "doc" | "any";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "any",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageTypes = ["image/jpeg", "image/png", "image/webp"];
    const zipTypes = ["application/zip", "application/x-zip-compressed"];
    const docTypes = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "text/plain",
      "text/csv",
    ];
  

  const onError = (err: { message: string }) => {
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video size must be less than 100MB");
        return false;
      }
    } else if (fileType === "image") {
      if (!imageTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, JPG or WebP)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return false;
      }
    } else if (fileType === "zip") {
      if (!zipTypes.includes(file.type)) {
        setError("Please upload a valid ZIP file");
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError("ZIP file size must be less than 50MB");
        return false;
      }
    } else {
      // Default to doc types
      if (!docTypes.includes(file.type)) {
        setError("Unsupported file type. Only PDF, DOCX, CSV, XLSX, ZIP or TXT allowed.");
        return false;
      }
      if (file.size > 25 * 1024 * 1024) {
        setError("File size must be less than 25MB");
        return false;
      }
    }

    return true;
  };

  const getFileNamePrefix = (fileType: string) => {
    switch (fileType) {
      case "image":
        return "image";
      case "zip":
        return "zip";
      case "doc":
        return "doc";
      case "video":
        return "video";

    }
  };

  const getAcceptMimeTypes = (fileType: string) => {
    switch (fileType) {
      case "video":
        return "video/*";
      case "image":
        return "image/*";
      case "zip":
        return ".zip,application/zip,application/x-zip-compressed";
      case "doc":
        return ".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv";
    
    }
  };
  
  const getFolderPath = (fileType: string) => {
    switch (fileType) {
      case "video":
        return "/videos";
      case "image":
        return "/images";
      case "zip":
        return "/zips";
      case "doc":
        return "/docs";
  
    }
  };
  
  

  return (
    <div className="space-y-2">
      <IKUpload
        fileName={getFileNamePrefix(fileType)}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handleStartUpload}
        onUploadProgress={handleProgress}
        accept={getAcceptMimeTypes(fileType)}
        className="file-input file-input-bordered w-full"
        validateFile={validateFile}
        useUniqueFileName={true}
        folder={getFolderPath(fileType)}
      />

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
}