import { NextRequest, NextResponse } from "next/server";

/**
 * Google OAuth callback handler.
 *
 * In production this would:
 * 1. Exchange the authorization code for tokens
 * 2. Store the refresh token securely for the employer
 * 3. Redirect back to the employer dashboard
 *
 * Requires environment variables:
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REDIRECT_URI
 */

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/employer/post?calendar=error", request.url));
  }

  if (!code) {
    // Initiate OAuth flow
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: "Google Calendar integration not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI." },
        { status: 500 },
      );
    }

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/calendar.events");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    return NextResponse.redirect(authUrl.toString());
  }

  // Exchange code for tokens (placeholder — real implementation needs googleapis)
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: "Missing Google credentials" }, { status: 500 });
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL("/employer/post?calendar=error", request.url));
    }

    // In production: store tokens securely (database, encrypted cookie, etc.)
    // const tokens = await tokenRes.json();

    return NextResponse.redirect(new URL("/employer/post?calendar=connected", request.url));
  } catch {
    return NextResponse.redirect(new URL("/employer/post?calendar=error", request.url));
  }
}
