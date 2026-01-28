import { NextRequest, NextResponse } from "next/server";

// Mock user database
const MOCK_USERS = {
  demo: {
    id: "user-1",
    username: "demo",
    password: "password", 
    email: "demo@example.com",
  },
  planner: {
    id: "user-2",
    username: "planner",
    password: "planner123",
    email: "planner@example.com",
  },
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Find user
    const user = Object.values(MOCK_USERS).find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    console.log("This is the _", _)
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.log("This is the error", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
