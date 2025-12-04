import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    const result = await convex.query(api.leads.checkStrataHubAccess, {
      email: email.toLowerCase(),
    });

    return NextResponse.json({
      hasUsed: result.hasUsed,
    });
  } catch (error) {
    console.error("Failed to check access:", error);
    return NextResponse.json({ hasUsed: false }); // Fail open
  }
}
