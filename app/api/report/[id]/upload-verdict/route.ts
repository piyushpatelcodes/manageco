import { connectToDatabase } from "@/lib/db";
import Report from "@/models/Report"; 
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🚀 ~ PATCH ~ body:", body)
    const { id, fileUrl, fileType, fileSize, imageKitFileId } = body;

    if ( !fileUrl || !fileType || !fileSize || !imageKitFileId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const session = await getCurrentUser();

    // Only labtester and admin can upload test results
    if (!session || !["labtester", "admin"].includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    const report = await Report.findById(id);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const testResult = {
      fileUrl,
      fileType,
      fileSize,
      imageKitFileId,
      uploadedBy: session.id,
    };

    report.testResults.push(testResult);
    await report.save();

    return NextResponse.json({
      message: "Test result uploaded successfully",
      testResult,
    });
  } catch (error) {
    console.error("Error in upload-verdict:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}