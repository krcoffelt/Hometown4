import { NextRequest, NextResponse } from "next/server";
import { getAuthConfig, isValidCredentials, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim();
    const password = String(body?.password ?? "");

    if (!isValidCredentials(email, password)) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    const { sessionToken } = getAuthConfig();
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const secureCookie = request.nextUrl.protocol === "https:" || forwardedProto === "https";

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: secureCookie,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to sign in." }, { status: 400 });
  }
}
