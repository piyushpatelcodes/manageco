// models/Report.ts
import { Schema, model, models, Types } from "mongoose";

export interface IReport {
  _id?: Types.ObjectId;
  title: string;
  uploadedBy: Types.ObjectId;
  sharedWith: Types.ObjectId[];
  fileUrl: string;                // Direct file URL from ImageKit
  fileType?: string;             // Optional: 'pdf', 'docx', 'xlsx', etc.
  fileSize?: number;             // In bytes
  imageKitFileId?: string;       // To enable future deletion or signed access
  // folder?: string;               // "reports", "invoices", etc.
  tags?: string[];               // Custom metadata
  isPrivate?: boolean;           // From ImageKit's isPrivateFile
  description?: string;
  status?: 'pending' | 'reviewed' | 'approved' | 'RejectedByLab' | 'RejectedByAdmin';
  testResults?: Array<{
    fileUrl: string; // Lab Tester's report URL
    fileType: string;
    fileSize: number;
    imageKitFileId: string;
    uploadedBy: Types.ObjectId; // Lab Tester
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

const reportSchema = new Schema<IReport>(
  {
    title: { type: String, required: true },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'approved', 'RejectedByLab' , 'RejectedByAdmin'],
      default: 'pending',
    },
    testResults: [
      {
        fileUrl: { type: String, required: true },
        fileType: { type: String, required: true },
        fileSize: { type: Number, required: true },
        imageKitFileId: { type: String, required: true },
        uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
  },
  { timestamps: true }
);

const Report = models.Report || model<IReport>('Report', reportSchema);

export default Report;
