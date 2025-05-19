"use client";

import { useEffect, useState } from "react";
import { IUser } from "@/models/User";
import { useRouter } from "next/navigation";
import { AlertTriangleIcon, Tag, TagIcon } from "lucide-react";
import { IReport } from "@/models/Report";

export default function ReportViewPage() {
  interface Report {
    title?: string;
    description?: string;
    sharedWith?: (IUser | string)[];
    status?: string;
    tags?: string[];
    similarTo?: IReport[];
    fileUrl?: string;
    fileType?: string;
    fileSize?: number;
    testResults?: Array<{
      fileUrl: string; // Lab Tester's report URL
      fileType: string;
      fileSize: number;
      imageKitFileId: string;
      uploadedBy: IUser; // Lab Tester ID
    }>;
  }

  const [report, setReport] = useState<Report | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("reportToView");
    if (!stored) {
      router.push("/dashboard"); // Redirect if no report found
      return;
    }

    const parsed = JSON.parse(stored);
    console.log("🚀 ~ useEffect ~ parsed:", parsed);
    setReport(parsed);
  }, [router]);

  if (!report) {
    return <div className="text-white p-6">Loading report...</div>;
  }

  const {
    title,
    description,
    sharedWith = [],
    status,
    tags = [],
    fileUrl,
    fileType,
    fileSize,
    testResults = [],
    similarTo = [],
  } = report;

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_ENDPOINT}/${url}`,
        {
          mode: "cors",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop() || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Unable to download file.");
      console.error(error);
    }
  };

  function formatStatus(status?: string) {
    switch (status) {
      case "pending":
        return "Pending";
      case "reviewed":
        return "Reviewed";
      case "approved":
        return "Approved";
      case "RejectedByLab":
        return "Rejected By Lab";
      case "RejectedByAdmin":
        return "Rejected By Admin";
      default:
        return status?.replace(/([a-z])([A-Z])/g, "$1 $2") ?? "Unknown";
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 space-y-6">
        <h1 className="text-3xl font-bold border-b border-gray-600 pb-2 gap-2 flex items-center">
          Report Details
          {status ? (
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                status === "RejectedByLab"
                  ? "bg-red-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
                  : status === "RejectedByAdmin"
                  ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                  : status === "pending"
                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                  : status === "approved"
                  ? "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-300"
                  : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              }`}
            >
              {formatStatus(status)}
            </span>
          ) : (
            <em className="text-gray-500">No status provided</em>
          )}
        </h1>

        {/* Title */}
        <div>
          <h2 className="text-sm text-gray-400">Title</h2>
          <p className="text-xl font-semibold">
            {title || <em className="text-gray-500">Untitled</em>}
          </p>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-sm text-gray-400">Description</h2>
          <p>
            {description || (
              <em className="text-gray-500">No description provided</em>
            )}
          </p>
        </div>

        {/* Recipients */}
        <div>
          <h2 className="text-sm text-gray-400 mb-1">Recipients</h2>
          <div className="flex flex-wrap gap-2">
            {sharedWith.length > 0 ? (
              sharedWith.map((user: IUser | string) => {
                const email = typeof user === "string" ? user : user.email;
                const role = typeof user === "string" ? user : user.role;
                const roleContent = `${
                  role === "superadmin"
                    ? "Superadmin"
                    : role === "admin"
                    ? "Admin"
                    : role === "sales"
                    ? "Sales"
                    : "Lab Personnel"
                }`;

                return (
                  <span
                    key={email}
                    data-tip={roleContent}
                    className="bg-purple-700 tooltip text-white px-3 py-1 rounded-full text-sm"
                  >
                    {email}
                  </span>
                );
              })
            ) : (
              <em className="text-gray-500">None</em>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h2 className="text-sm text-gray-400 mb-1">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(tags) && tags.length > 0 ? (
              tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-700 text-white px-3 py-1 rounded-full text-sm flex gap-2 items-center"
                >
                  <TagIcon size={15} /> {tag}
                </span>
              ))
            ) : (
              <em className="text-gray-500">No tags</em>
            )}
          </div>
        </div>

        {/* File Info + Download */}
        <h2 className="text-lg text-gray-400 mt-1">Attachments [File Info]</h2>
        {fileUrl ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <a
                onClick={() => {
                  handleDownload(fileUrl);
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline cursor-pointer"
              >
                {fileUrl.split("/").pop()}
              </a>
              <button
                onClick={() => {
                  handleDownload(fileUrl);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Download
              </button>

              <span className="bg-red-700 text-white px-2 py-0.5 rounded text-xs">
                {fileType?.toUpperCase()}
              </span>
              <span className="text-gray-400 text-sm">
                {(fileSize! / 1024).toFixed(2)} KB
              </span>
            </div>

            {/* Preview */}
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <h2 className="text-sm text-gray-400 p-2">
                Preview of Sales person's Reports/Attachments
              </h2>
              {fileType === "pdf" ? (
                <iframe
                  src={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/${fileUrl}`}
                  title="PDF Preview"
                  className="w-full h-[600px] bg-white"
                />
              ) : fileType?.match(/(jpg|jpeg|png|gif|webp)/i) ? (
                <iframe
                  src={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/${fileUrl}`}
                  title="Image Preview"
                  className="max-w-full max-h-[600px] object-contain mx-auto"
                />
              ) : (
                <p className="italic text-gray-500">
                  Preview not available for this file type.
                </p>
              )}
            </div>
          </div>
        ) : (
          <em className="text-gray-500">No file uploaded</em>
        )}
        {/* Similar Reports Section */}
        {similarTo.length > 0 ? (
          <div className="space-y-4 border-t-4  border-gray-600  ">
            <p className="items-center justify-center flex gap-2  hover:text-yellow-500 transition-colors duration-500 text-lg font-bold text-white bg-amber-600 p-2 rounded-md mt-5">
              <AlertTriangleIcon className="animate-bounce" /> SIMILAR REPORTS
              FOUND
            </p>
            {similarTo.map((report, index) => (
              <div
                key={index}
                className="space-y-3 border-b border-gray-600 pb-4"
              >
                <h3 className="text-xl font-semibold">{`Similar Report ${
                  index + 1
                }`}</h3>
                <p className="text-lg flex flex-wrap gap-2 font-bold bg-base-200 p-2 rounded-lg">
                  Title: {report.title}
                  {report.tags && (
                    <span className="flex flex-wrap gap-2 opacity-55 hover:opacity-90 transition-opacity duration-500">
                      {report.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-extralight flex gap-2 items-center"
                        >
                          <Tag size={15} /> {tag}
                        </span>
                      ))}
                    </span>
                  )}
                </p>
                {description ? (
                  <div className="collapse collapse-arrow text-black bg-gray-200  dark:text-white dark:bg-base-300/40">
                    <input type="checkbox" />
                    <div className="collapse-title text-md font-medium">
                      Description
                    </div>
                    <div className="collapse-content">
                      <p className="text-sm">
                        {report?.description || "No description provided."}
                      </p>
                      <p className="text-xs mt-5 italic border-gray-500 border-t-2 pt-2">
                        Uploaded At:{" "}
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "N/A"}
                      </p>
                      <p className="text-xs flex gap-2 mt-1 italic">
                        Uploaded By: {(report.uploadedBy as unknown as IUser)?.email}
                        <span className="bg-purple-500/40 px-1 rounded-md">{(report.uploadedBy as unknown as IUser)?.role} Person</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <em className="text-gray-500">No Descriptin Provided</em>
                )}
              </div>
            ))}
          </div>
        ) : (
          <em className="text-gray-500">No similar reports found</em>
        )}

        {/* Test Results Section */}
        {testResults.length > 0 ? (
          <div className="space-y-4 border-t-4  border-gray-600">
            <p className="text-lg font-bold text-white bg-green-500 p-2 rounded-md mt-5">
              TEST RESULTS
            </p>
            {testResults.map((testResult, index) => (
              <div
                key={index}
                className="space-y-3 border-b border-gray-600 pb-4"
              >
                <h3 className="text-xl font-semibold">{`Test Result ${
                  index + 1
                }`}</h3>
                <p className="text-xl">
                  By: {testResult.uploadedBy?.email}{" "}
                  <span className="bg-purple-600 p-2 rounded-md text-sm">
                    {(() => {
                      const { role } = testResult.uploadedBy!;
                      return role === "superadmin"
                        ? "Superadmin"
                        : role === "admin"
                        ? "Admin"
                        : role === "sales"
                        ? "Sales"
                        : "Lab Personnel";
                    })()}
                  </span>
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    onClick={() => {
                      handleDownload(testResult.fileUrl);
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline cursor-pointer"
                  >
                    {testResult.fileUrl.split("/").pop()}
                  </a>
                  <button
                    onClick={() => {
                      handleDownload(testResult.fileUrl);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Download Test Result
                  </button>

                  <span className="bg-red-700 text-white px-2 py-0.5 rounded text-xs">
                    {testResult.fileType?.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {(testResult.fileSize / 1024).toFixed(2)} KB
                  </span>
                </div>
                {testResult.fileType === "pdf" ? (
                  <iframe
                    src={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/${testResult.fileUrl}`}
                    title="PDF Preview"
                    className="w-full h-[600px] bg-white"
                  />
                ) : testResult.fileType?.match(/(jpg|jpeg|png|gif|webp)/i) ? (
                  <iframe
                    src={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/${testResult.fileUrl}`}
                    title="Image Preview"
                    className="max-w-full max-h-[600px] object-contain mx-auto"
                  />
                ) : (
                  <p className="italic text-gray-500">
                    Preview not available for this file type.
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <em className="text-gray-500">No test results available</em>
        )}
      </div>
    </div>
  );
}
