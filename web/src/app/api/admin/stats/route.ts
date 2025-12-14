import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalDocuments,
      activeDocuments,
      totalUsers,
      totalInquiries,
      todayInquiries,
      weekInquiries,
      monthInquiries,
      helpfulFeedback,
      notHelpfulFeedback,
      avgResponseTime,
      documentsByCategory,
    ] = await Promise.all([
      prisma.document.count(),
      prisma.document.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.inquiry.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.inquiry.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.inquiry.count({ where: { feedback: "HELPFUL" } }),
      prisma.inquiry.count({ where: { feedback: "NOT_HELPFUL" } }),
      prisma.inquiry.aggregate({
        _avg: { responseTimeMs: true },
        where: { responseTimeMs: { not: null } },
      }),
      prisma.document.groupBy({
        by: ["category"],
        _count: { id: true },
      }),
    ]);

    const totalFeedback = helpfulFeedback + notHelpfulFeedback;
    const satisfactionRate =
      totalFeedback > 0
        ? Math.round((helpfulFeedback / totalFeedback) * 100)
        : 0;

    return NextResponse.json({
      documents: {
        total: totalDocuments,
        active: activeDocuments,
        byCategory: documentsByCategory.reduce(
          (acc, item) => {
            acc[item.category] = item._count.id;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
      users: {
        total: totalUsers,
      },
      inquiries: {
        total: totalInquiries,
        today: todayInquiries,
        thisWeek: weekInquiries,
        thisMonth: monthInquiries,
        avgResponseTimeMs: Math.round(avgResponseTime._avg.responseTimeMs || 0),
      },
      feedback: {
        helpful: helpfulFeedback,
        notHelpful: notHelpfulFeedback,
        satisfactionRate,
      },
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching stats" },
      { status: 500 }
    );
  }
}
