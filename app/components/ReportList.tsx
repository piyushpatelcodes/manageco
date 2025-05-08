import { IReport } from "@/models/Report"; // Assuming IReport is your report model
import ReportComponent from "./ReportComponent";

interface ReportListProps {
  reports: IReport[];
  isHorizontal?: boolean; 
}

export default function ReportList({ reports,  isHorizontal = true }: ReportListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {reports.map((report) => (
        <ReportComponent key={report._id?.toString()} report={report} isHorizontal={isHorizontal}  />
      ))}

      {reports.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-base-content/70">No reports found</p>
        </div>
      )}
    </div>
  );
}
