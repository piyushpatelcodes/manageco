"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";
import { IUser } from "@/models/User";
import { Types } from "mongoose";

interface ReportFormData {
  title: string;
  description: string;
  fileUrl: string;
  fileType:string;
  fileSize:number;
  imageKitFileId:string;
  tags:string[];
  sharedWith: string[];
}

export default function DocumentUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recipients, setRecipients] = useState<IUser[]>([]);
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReportFormData>({
    defaultValues: {
      title: "",
      description: "",
      fileUrl: "",
      fileType:"",
      fileSize:0,
      imageKitFileId:"",
      tags:[],
      sharedWith: [],
    },
  });

  // Fetch the list of lab testers (or relevant role) from the backend
  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const response = await apiClient.getRecipients(); // Make an API call to get the list of lab testers
        console.log("🚀 ~ fetchRecipients ~ response:", response)
        setRecipients(response);
      } catch (error) {
        console.error("Failed to fetch recipients", error);
      }
    };

    fetchRecipients();
  }, []);

  const handleUploadSuccess = (response: { filePath: string; size:number; fileId:string }) => {
    console.log("🚀 ~ handleUploadSuccess ~ response:", response)
    setValue("fileUrl", response.filePath); 
    setValue("fileSize", response.size); 
    setValue("fileType", response.filePath.split('.').pop() || "Document"); 
    setValue("imageKitFileId", response.fileId); 
    showNotification("Document uploaded successfully!", "success");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: ReportFormData) => {
    if (!data.fileUrl || !data.fileSize || !data.fileType || !data.imageKitFileId) {
      showNotification("Please upload a document first", "error");
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        ...data,
        sharedWith: data.sharedWith
      .map((email: string) => {
        const user = recipients.find((recipient) => recipient.email === email);
        return user ? user._id : undefined; // Convert email to ObjectId, or undefined if no user is found
      })
      .filter((id): id is Types.ObjectId => id !== undefined),
        tags: data?.tags?.map(tag => tag?.trim()) ?? "",
      };
  
      // Send the updated data
      await apiClient.sendDocument(updatedData);
      showNotification("Document sent successfully!", "success");

      // Reset form after successful submission
      setValue("title", "");
      setValue("description", "");
      setValue("fileUrl", "");
      setValue("fileSize", 0);
      setValue("imageKitFileId", "");
      setValue("tags", []);
      setValue("sharedWith", []);
      setUploadProgress(0);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to send document",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-control">
        <label className="label">Title</label>
        <input
          type="text"
          className={`input input-bordered ${
            errors.title ? "input-error" : ""
          }`}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <span className="text-error text-sm mt-1">{errors.title.message}</span>
        )}
      </div>

      <div className="form-control">
        <label className="label">Description</label>
        <textarea
          className={`textarea textarea-bordered h-24 ${
            errors.description ? "textarea-error" : ""
          }`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-error text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="form-control">
        <label className="label">Upload Document</label>
        <FileUpload
          onSuccess={handleUploadSuccess}
          onProgress={handleUploadProgress}
        />
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      <div className="form-control">
        <label className="label">Select Recipient</label>
        <select
          className={`select select-bordered ${errors.sharedWith ? "select-error" : ""}`}
          {...register("sharedWith", { required: "Please select a recipient" })}
          multiple
        >
          <option value="">Select a lab tester</option>
          {recipients.map((recipient) => (
            <option key={recipient.email} value={recipient.email}>
              {recipient.email}
            </option>
          ))}
        </select>
        {errors.sharedWith && (
          <span className="text-error text-sm mt-1">
            {errors.sharedWith.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={loading || !uploadProgress}
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
