import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { inquiryId, feedback } = await request.json();

  if (!inquiryId || !feedback) {
    return NextResponse.json(
      { error: "inquiryId and feedback are required" },
      { status: 400 }
    );
  }

  if (feedback !== "HELPFUL" && feedback !== "NOT_HELPFUL") {
    return NextResponse.json(
      { error: "Invalid feedback value" },
      { status: 400 }
    );
  }

  try {
    // Verify the inquiry belongs to the user
    const inquiry = await prisma.inquiry.findFirst({
      where: {
        id: inquiryId,
        userId: session.user.id,
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    // Update feedback
    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { feedback },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "FEEDBACK",
        target: inquiryId,
        details: { feedback },
        ipAddress:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown",
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "An error occurred while saving feedback" },
      { status: 500 }
    );
  }
}
