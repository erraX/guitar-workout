import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateToken, validateCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (!validateCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await generateToken(username);

  // Set cookie
  (await cookies()).set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 3, // 24 hours
  });

  return NextResponse.json({ success: true });
}
