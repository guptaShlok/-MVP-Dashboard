import { NextRequest, NextResponse } from "next/server";

// Mock requests database
const MOCK_REQUESTS = [
  {
    id: "req-001",
    jobId: "98127",
    name: "Routing-MIP-Q3",
    status: "running",
    duration: "02:14",
    updated: "2m ago",
    hasFiles: false,
    createdAt: new Date(Date.now() - 2 * 60000), // 2 minutes ago
  },
  {
    id: "req-002",
    jobId: "98126",
    name: "Portfolio-Opt-Alpha",
    status: "finished",
    duration: "15:03",
    updated: "41m ago",
    hasFiles: true,
    createdAt: new Date(Date.now() - 41 * 60000), // 41 minutes ago
  },
  {
    id: "req-003",
    jobId: "98125",
    name: "Machine-Setup-Beta",
    status: "finished",
    duration: "08:45",
    updated: "2h ago",
    hasFiles: true,
    createdAt: new Date(Date.now() - 2 * 3600000), // 2 hours ago
  },
  {
    id: "req-004",
    jobId: "98124",
    name: "Workforce-Allocation-V2",
    status: "failed",
    duration: "12:30",
    updated: "5h ago",
    hasFiles: true,
    createdAt: new Date(Date.now() - 5 * 3600000), // 5 hours ago
  },
  {
    id: "req-005",
    jobId: "98123",
    name: "Production-Schedule-Weekly",
    status: "finished",
    duration: "20:15",
    updated: "1d ago",
    hasFiles: true,
    createdAt: new Date(Date.now() - 24 * 3600000), // 1 day ago
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get("days") || "7", 10);

  const cutoffDate = new Date(Date.now() - days * 24 * 3600000);
  const filteredRequests = MOCK_REQUESTS.filter(
    (req) => req.createdAt >= cutoffDate,
  );

  return NextResponse.json(filteredRequests);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create a new request
    const newRequest = {
      id: `req-${Date.now()}`,
      jobId: Math.floor(98000 + Math.random() * 1000).toString(),
      name: body.sched_req_name || "New Request",
      status: "pending",
      duration: "0:00",
      updated: "now",
      hasFiles: false,
      createdAt: new Date(),
    };

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
      console.log("Error in creating request", error)
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 400 },
    );
  }
}
