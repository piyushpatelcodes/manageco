import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import ReportModel from '@/models/Report'
import ReportCache from '@/models/ReportCache'
import crypto from 'crypto'

const normalize = (str: string) =>
  str.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^\w\s]/gi, '')

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { query } = body

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid query' }, { status: 400 })
  }

  const normQuery = normalize(query)
  const queryKey = crypto.createHash('sha256').update(normQuery).digest('hex')

  await connectToDatabase()

  // 1. Try cache first
  const cached = await ReportCache.findOne({ queryKey })
  if (cached) {
    const reports = await ReportModel.find({ _id: { $in: cached.productIds } })
    return NextResponse.json({ exists: reports.length > 0, similarReports: reports })
  }

  // 2. Fallback to MongoDB Atlas search on both `title` and `tags`
  const result = await ReportModel.aggregate([
    {
      $search: {
        compound: {
          should: [
            {
              text: {
                query: normQuery,
                path: 'title',
                fuzzy: { maxEdits: 2, prefixLength: 1 },
              },
            },
            {
              text: {
                query: normQuery,
                path: 'tags',
              },
            },
          ],
        },
      },
    },
    { $limit: 5 },
  ])

  const productIds = result.map((r) => r._id)

  await ReportCache.create({
    queryKey,
    productIds,
    accessedAt: new Date(),
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
  })

  return NextResponse.json({ exists: productIds.length > 0, similarReports: result })
}
