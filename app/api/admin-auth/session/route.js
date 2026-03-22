import { NextResponse } from "next/server";

export async function GET(request) {
  const isAuthenticated =
    request.cookies.get("admin_auth")?.value === "authenticated";

  return NextResponse.json({ authenticated: isAuthenticated });
}
