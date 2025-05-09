import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useNotification } from "./Notification";
import FileUpload from "./FileUpload";

interface ReportFormData {
  fileUrl: string;
  fileType: string;
  fileSize: number;
  imageKitFileId: string;
}

export default function UploadVerdictForm({
  reportId,
  closeModal,
}: {
  reportId: string | undefined;
  closeModal: () => void;
}) {
  
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReportFormData>( {
    defaultValues: {
      fileUrl: "",
      fileType: "",
      fileSize: 0,
      imageKitFileId: "",
    },
  });

  // Handle upload success - set the form values based on the response
  const handleUploadSuccess = (response: {filePath:string, size:number, fileId:string}) => {
    setValue("fileUrl", response.filePath);
    setValue("fileSize", response.size);
    setValue("fileType", response.filePath.split(".").pop() || "Document");
    setValue("imageKitFileId", response.fileId);
    showNotification("Document uploaded successfully!", "success");
  };

  // Handle upload progress
  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  // Handle form submission
  const onSubmit = async (data: ReportFormData) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    if (!reportId) {
      console.error("Report ID is undefined");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/report/${reportId}/upload-verdict`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrl: data.fileUrl,
          fileType: data.fileType,
          fileSize: data.fileSize,
          imageKitFileId: data.imageKitFileId,
          id:reportId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload verdict");
      }

      // Close the modal after success
      closeModal();
      showNotification("Verdict uploaded successfully!", "success");
      setValue("fileUrl", "");
      setValue("fileSize", 0);
      setValue("fileType", "");
      setValue("imageKitFileId", "");
    } catch (error) {
      showNotification("Error uploading verdict", "error");
      console.error("Error uploading verdict:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-control">
        <label className="label">Please Upload in PDF Format</label>
        <FileUpload
          onSuccess={handleUploadSuccess}
          onProgress={handleUploadProgress}
        />
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-800 dark:bg-gray-800 rounded-full h-2.5 mt-2">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={loading || uploadProgress === 0}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending Document...
          </>
        ) : (
          "Send Document"
        )}
      </button>
    </form>
  );
}
