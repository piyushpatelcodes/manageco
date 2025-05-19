import mongoose, { Schema, Types } from 'mongoose'

export interface IReportCache {
  queryKey: string
  productIds: Types.ObjectId[]
  createdAt: Date
  accessedAt: Date
  expiresAt: Date
}

const ReportCacheSchema = new Schema<IReportCache>({
  queryKey: { type: String, required: true, unique: true },
  productIds: [{ type: Schema.Types.ObjectId, ref: 'Report', required: true }],
  createdAt: { type: Date, default: Date.now },
  accessedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
})

ReportCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.ReportCache || mongoose.model<IReportCache>('ReportCache', ReportCacheSchema)
