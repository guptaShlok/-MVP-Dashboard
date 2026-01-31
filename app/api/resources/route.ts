import { NextRequest, NextResponse } from "next/server";

// Mock resources database
const MOCK_RESOURCES = [
  {
    id: "res-001",
    name: "Production_Machines_Q1_2026.csv",
    type: "machines",
    size: "245 KB",
    uploadedAt: "2026-01-15",
    updatedAt: "2h ago",
  },
  {
    id: "res-002",
    name: "Workforce_Schedule_Main.xlsx",
    type: "workforce",
    size: "512 KB",
    uploadedAt: "2026-01-20",
    updatedAt: "1d ago",
  },
  {
    id: "res-003",
    name: "Setup_Matrix_Standard.csv",
    type: "setup_matrix",
    size: "128 KB",
    uploadedAt: "2026-01-10",
    updatedAt: "5d ago",
  },
];

export async function GET(request: NextRequest) {
  return NextResponse.json(MOCK_RESOURCES);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newResource = {
      id: `res-${Date.now()}`,
      name: body.name || "New Resource",
      type: body.type || "setup_matrix",
      size: body.size || "0 KB",
      uploadedAt: new Date().toISOString().split("T")[0],
      updatedAt: "now",
    };

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.log("Error in reosources, route.ts", error)
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 400 },
    );
  }
}
