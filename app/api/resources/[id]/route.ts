import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
  console.log("THis is the id", id);
  try {
    // Mock: Delete resource
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error inside dynamic id inside resources", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 },
    );
  }
}
