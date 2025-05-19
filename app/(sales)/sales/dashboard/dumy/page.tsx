'use client'

import { useEffect, useState } from 'react'

export default function SimilarReportChecker() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [similarReports, setSimilarReports] = useState<any[]>([])
  const [exists, setExists] = useState(false)

  const checkSimilarity = async (text: string) => {
    if (!text.trim()) {
      setSimilarReports([])
      setExists(false)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/check-similar-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      })

      const data = await res.json()
      setSimilarReports(data.similarReports || [])
      setExists(data.exists)
      console.log("🚀 ~ checkSimilarity ~ data:", data)
    } catch (err) {
      console.error('Error checking similarity:', err)
    }

    setLoading(false)
  }

  // Debounce user input
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim().length > 2) checkSimilarity(query)
    }, 500)

    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">Check Similar Product</h2>
      <input
        type="text"
        placeholder="Type product name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4"
      />

      {loading && <p>Checking for similar products...</p>}

      {exists && (
        <div className="bg-yellow-100 p-3 border border-yellow-400 rounded mb-4">
          <p className="font-medium text-yellow-800">
            ⚠️ Similar product(s) found. Consider reviewing before uploading.
          </p>
        </div>
      )}

      {similarReports.length > 0 && (
        <ul className="space-y-2">
          {similarReports.map((report) => (
            <li key={report._id} className="border p-2 rounded bg-gray-800">
              <p className="font-extrabold font-">{report.title}</p>
              <p className="font-extralight">{report.description?.slice(0,100)}</p>
              {report.tags && (

              <p className="text-sm text-gray-600">Tags: {report.tags?.join(', ')}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
