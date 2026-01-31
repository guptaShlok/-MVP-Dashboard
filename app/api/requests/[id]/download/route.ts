import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  // Mock: Generate a ZIP file content
  // In production, this would fetch actual result files
//   const mockZipContent = `UEsDBAoAAAAAAEQ...`; // Simplified mock

  try {
    // Create a mock ZIP response
    const response = new NextResponse(
      Buffer.from("Mock ZIP file content - results for " + id),
      {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="request-${id}.zip"`,
        },
      },
    );

    return response;
  } catch (error) {
    console.log("Error in the request id download route", error)
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 },
    );
  }
}
