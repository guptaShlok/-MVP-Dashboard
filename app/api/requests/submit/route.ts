import { NextRequest, NextResponse } from "next/server";

// Mock request store with simulated backend processing
const requestStore = new Map<
  string,
  {
    id: string;
    status: "pending" | "running" | "finished" | "failed";
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    duration?: string;
    resultFiles?: string[];
    errorLog?: string;
  }
>();

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const requestId = payload.sched_req_id || `REQ_${Date.now()}`;

    // Create request record
    const record = {
      id: requestId,
      status: "pending" as const,
      createdAt: new Date(),
    };

    requestStore.set(requestId, record);

    // Simulate backend processing by updating status after a delay
    setTimeout(() => {
      const stored = requestStore.get(requestId);
      if (stored) {
        stored.status = "running";
        stored.startedAt = new Date();
      }
    }, 1000);

    // Simulate completion after random time
    const completionTime = 2000 + Math.random() * 8000;
    setTimeout(() => {
      const stored = requestStore.get(requestId);
      if (stored && Math.random() > 0.1) {
        // 90% success rate
        const duration = Math.floor(Math.random() * 20) + 5;
        stored.status = "finished";
        stored.completedAt = new Date();
        stored.duration = `${duration}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`;
        stored.resultFiles = [
          `results-${requestId}.csv`,
          `metrics-${requestId}.json`,
          `visualization-${requestId}.png`,
        ];
      } else if (stored) {
        stored.status = "failed";
        stored.completedAt = new Date();
        stored.errorLog =
          "Optimization solver encountered a constraint violation.";
      }
    }, completionTime);

    return NextResponse.json(
      {
        success: true,
        requestId,
        message: "Request submitted successfully",
        status: "pending",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in submit of the inside the requests", error)
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 400 },
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const requestId = searchParams.get("id");

  if (!requestId) {
    return NextResponse.json({ error: "Request ID required" }, { status: 400 });
  }

  const record = requestStore.get(requestId);
  if (!record) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}
