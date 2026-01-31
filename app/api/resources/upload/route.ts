import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Mock: Process file upload
    const newResource = {
      id: `res-${Date.now()}`,
      name: file.name,
      type: type,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      uploadedAt: new Date().toISOString().split("T")[0],
      updatedAt: "now",
    };

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.log("Error in uploading api", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
