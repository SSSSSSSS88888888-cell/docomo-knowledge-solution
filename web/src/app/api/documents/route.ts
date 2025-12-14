import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { indexDocument } from "@/lib/vector-search";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          category: true,
          version: true,
          confidentiality: true,
          isActive: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.document.count({ where }),
    ]);

    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Documents fetch error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, category, content, filePath, confidentiality, tags } = body;

  if (!title || !category || !content) {
    return NextResponse.json(
      { error: "Title, category, and content are required" },
      { status: 400 }
    );
  }

  try {
    const document = await prisma.document.create({
      data: {
        title,
        category,
        content,
        filePath: filePath || `/documents/${Date.now()}.md`,
        confidentiality: confidentiality || "INTERNAL",
        tags: tags || [],
        createdBy: session.user.id,
      },
    });

    // Index the document for vector search
    try {
      await indexDocument(document.id, content);
    } catch (indexError) {
      console.error("Document indexing error:", indexError);
      // Continue even if indexing fails
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_DOCUMENT",
        target: document.id,
        details: { title, category },
        ipAddress:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown",
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Document creation error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the document" },
      { status: 500 }
    );
  }
}
