// pages/api/reports/[id].ts
import mongoose from "mongoose";
import Report from "../../../../models/Report"; 
import { connectToDatabase } from "@/lib/db";
import { validatePatchFields } from "@/middlewares/validatePatchFields";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import User from "@/models/User";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function PATCH(req: NextRequest) {
  const validation = await validatePatchFields(req);
  if ("error" in validation) return validation.error;

  const { body } = validation;
  const id = req.nextUrl.pathname.split("/").pop()!;
  console.log("🚀 ~ PATCH report ~ id:", id,body,validation)

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return NextResponse.json({ message: "Invalid report ID" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const updated = await Report.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update report", err },
      { status: 500 }
    );
  }
}



export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  
  const currentUser = await getCurrentUser();

  const userId = currentUser.id;  
  const userRole = currentUser.role;  

  try {
    const report = await Report.findById(id);

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const uploader = await User.findById(report.uploadedBy);

    if (!uploader) {
      return NextResponse.json({ error: 'Uploader of file not found' }, { status: 404 });
    }

    // If the user is not the uploader, deny access
    if (report.uploadedBy.toString() !== userId && userRole !== uploader.role && report.status !== "pending") {
      return NextResponse.json(
        { error: 'You are not authorized to delete this report' },
        { status: 403 }
      );
    }

     // If the report has an ImageKit file ID, delete it from ImageKit
     if (report.imageKitFileId) {
      const deleteResponse = await imagekit.deleteFile(report.imageKitFileId);
      console.log("🚀 ~ DELETE ~ reportdeleteResponse:", deleteResponse)
      if (deleteResponse) {
        console.log(`File ${report.imageKitFileId} deleted from ImageKit`);
      } else {
        return NextResponse.json(
          { error: 'Failed to delete file from ImageKit' },
          { status: 500 }
        );
      }
    }

    // Delete associated test results from ImageKit if any
    if (report.testResults && report.testResults.length > 0) {
      for (const testResult of report.testResults) {
        if (testResult.imageKitFileId) {
          const deleteResponse = await imagekit.deleteFile(testResult.imageKitFileId);
          if (deleteResponse) {
            console.log(`File ${testResult.imageKitFileId} deleted from ImageKit`);
          }
        }
      }
    }


    await Report.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Report deleted successfully' });

  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
