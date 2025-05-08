"use client";

import React, { useEffect, useState } from "react";
import ReportList from "../../../components/ReportList";
import { IReport } from "@/models/Report";
import { apiClient } from "@/lib/api-client";

export default function Home() {
  const [reports, setReports] = useState<IReport[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiClient.getReports();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8"> Admin dashboard</h1>
      <ReportList reports={reports} />
    </main>
  );
}