import { NextResponse } from "next/server";
import { isValidSessionCookie } from "./lib/auth";

export const config = {
  matcher: ["/dashboard/:path*"],
};

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/dashboard/login")) {
    return NextResponse.next();
  }
  const cookie = request.cookies.get("dashboard_session")?.value;
  if (!isValidSessionCookie(cookie)) {
    const loginUrl = new URL("/dashboard/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
