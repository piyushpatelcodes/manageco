// models/Report.ts
import { Schema, model, models, Types } from "mongoose";

export interface IReport {
  _id?: Types.ObjectId;
  title: string;
  uploadedBy: Types.ObjectId;
  sharedWith: Types.ObjectId[];
  fileUrl?: string; // Direct file URL from ImageKit
  fileType?: string; // Optional: 'pdf', 'docx', 'xlsx', etc.
  fileSize?: number; // In bytes
  imageKitFileId?: string; // To enable future deletion or signed access
  // folder?: string;               // "reports", "invoices", etc.
  tags?: string[]; // Custom metadata
  isPrivate?: boolean; // From ImageKit's isPrivateFile
  description?: string;
  similarTo?: Types.ObjectId[];
  status?:
    | "pending"
    | "reviewed"
    | "approved"
    | "RejectedByLab"
    | "RejectedByAdmin";
  testResults?: Array<{
    fileUrl: string; // Lab Tester's report URL
    fileType: string;
    fileSize: number;
    imageKitFileId: string;
    uploadedBy: Types.ObjectId; // Lab Tester
    score?: Array<{
      name: string; // Name of the test or metric
      relatedTo: string;
      value?: number | string; // Actual measured value
      unit?: string; // Measurement unit (e.g., mg/L, %, etc.)
      range?: [number, number]; // Observed range (if applicable)
      expectedRange?: [number, number]; // Ideal or expected range
      remarks?: string; // Optional comments or notes
      verdict: boolean; 
    }>;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

const reportSchema = new Schema<IReport>(
  {
    title: { type: String, required: true },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true }, // e.g., 'pdf', 'docx', etc.
    fileSize: { type: Number, required: true }, // in bytes
    imageKitFileId: { type: String, required: true }, // needed for deletions
    // folder: { type: String }, // logical folder structure
    tags: [{ type: String }], // metadata for filtering
    isPrivate: { type: Boolean, default: false },
    description: { type: String },
    similarTo: [{ type: Schema.Types.ObjectId, ref: "Report" }],
    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "approved",
        "RejectedByLab",
        "RejectedByAdmin",
      ],
      default: "pending",
    },
    testResults: [
      {
        fileUrl: { type: String, required: true },
        fileType: { type: String, required: true },
        fileSize: { type: Number, required: true },
        imageKitFileId: { type: String, required: true },
        uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        score: [
          {
            name: { type: String, required: true }, // Test name
            relatedTo: { type: String, required: true }, // Test name
            value: { type: Schema.Types.Mixed,  }, // Accepts number or string
            unit: { type: String }, // e.g., mg/L
            range: {
              type: [Number], // Observed range
              validate: {
                validator: (v: number[]) => v.length === 2,
                message: "Range must contain exactly two numbers",
              },
            },
            expectedRange: {
              type: [Number], // Ideal/expected range
              validate: {
                validator: (v: number[]) => v.length === 2,
                message: "Expected range must contain exactly two numbers",
              },
            },
            remarks: { type: String }, // Optional notes
            verdict: { type: Boolean , required: true}, 
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Report = models.Report || model<IReport>("Report", reportSchema);

export default Report;
