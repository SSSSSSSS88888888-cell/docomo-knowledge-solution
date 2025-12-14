import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateRAGResponse, generateMockRAGResponse } from "@/lib/ai";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { question } = await request.json();

  if (!question || typeof question !== "string") {
    return NextResponse.json(
      { error: "Question is required" },
      { status: 400 }
    );
  }

  const startTime = Date.now();

  try {
    // Use mock response if API keys are not configured or are placeholders
    const hasValidOpenAIKey = process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY.length > 20 &&
      !process.env.OPENAI_API_KEY.includes("...");
    const hasValidAnthropicKey = process.env.ANTHROPIC_API_KEY &&
      process.env.ANTHROPIC_API_KEY.length > 20 &&
      !process.env.ANTHROPIC_API_KEY.includes("...");
    const useMock = !hasValidOpenAIKey || !hasValidAnthropicKey;

    console.log("[Search] Starting search, useMock:", useMock);

    const result = useMock
      ? await generateMockRAGResponse(question)
      : await generateRAGResponse(question, session.user.id);

    const responseTimeMs = Date.now() - startTime;
    console.log("[Search] Got result in", responseTimeMs, "ms");

    // Try to save logs, but don't fail the request if logging fails
    let inquiryId = "temp-" + Date.now();
    try {
      const inquiry = await db.createInquiry({
        userId: session.user.id,
        question,
        aiResponse: result.response,
        sourceDocs: result.sources,
        responseTimeMs,
        resolved: result.sources.length > 0,
      });
      inquiryId = inquiry.id;

      await db.createAuditLog({
        userId: session.user.id,
        action: "SEARCH",
        target: question.slice(0, 100),
        details: {
          inquiryId: inquiry.id,
          sourceCount: result.sources.length,
          mock: useMock,
        },
        ipAddress:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown",
        userAgent: request.headers.get("user-agent") || undefined,
      });
    } catch (logError) {
      console.error("[Search] Failed to save logs:", logError);
      // Continue anyway - we still have the search result
    }

    return NextResponse.json({
      inquiryId,
      response: result.response,
      sources: result.sources,
      responseTimeMs,
    });
  } catch (error) {
    console.error("[Search] Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
