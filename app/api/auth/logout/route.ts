import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const secureCookie = request.nextUrl.protocol === "https:" || forwardedProto === "https";

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: secureCookie,
    sameSite: "lax",
    maxAge: 0,
    path: "/"
  });
  return response;
}
