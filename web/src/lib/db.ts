import { Pool } from "pg";

// Create a connection pool using pg (works without Prisma binary)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// DB helper functions using pg directly
export const db = {
  async query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
    const result = await pool.query(text, params);
    return result.rows as T[];
  },

  async queryOne<T = unknown>(text: string, params?: unknown[]): Promise<T | null> {
    const result = await pool.query(text, params);
    return (result.rows[0] as T) || null;
  },

  // Create inquiry log
  async createInquiry(data: {
    userId: string;
    question: string;
    aiResponse: string;
    sourceDocs: unknown;
    responseTimeMs: number;
    resolved: boolean;
  }) {
    const result = await pool.query(
      `INSERT INTO "Inquiry" (id, "userId", question, "aiResponse", "sourceDocs", "responseTimeMs", resolved, "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())
       RETURNING id`,
      [data.userId, data.question, data.aiResponse, JSON.stringify(data.sourceDocs), data.responseTimeMs, data.resolved]
    );
    return result.rows[0];
  },

  // Create audit log
  async createAuditLog(data: {
    userId: string;
    action: string;
    target: string;
    details: unknown;
    ipAddress: string;
    userAgent?: string;
  }) {
    await pool.query(
      `INSERT INTO "AuditLog" (id, "userId", action, target, details, "ipAddress", "userAgent", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())`,
      [data.userId, data.action, data.target, JSON.stringify(data.details), data.ipAddress, data.userAgent || null]
    );
  },

  // Find user by email
  async findUserByEmail(email: string) {
    const result = await pool.query(
      `SELECT id, email, name, password, role FROM "User" WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  },

  // Get all active documents
  async getActiveDocuments() {
    const result = await pool.query(
      `SELECT id, title, category, content, "filePath", version, confidentiality, tags
       FROM "Document" WHERE "isActive" = true`
    );
    return result.rows;
  },

  // Get document chunks with embeddings for vector search
  async searchSimilarChunks(embedding: number[], limit: number = 5) {
    const result = await pool.query(
      `SELECT dc.id, dc."documentId", dc.content, dc."chunkIndex",
              d.title as "documentTitle",
              1 - (dc.embedding <=> $1::vector) as score
       FROM "DocumentChunk" dc
       JOIN "Document" d ON dc."documentId" = d.id
       WHERE d."isActive" = true
       ORDER BY dc.embedding <=> $1::vector
       LIMIT $2`,
      [`[${embedding.join(",")}]`, limit]
    );
    return result.rows;
  },
};

// Export pool for direct access if needed
export { pool };

// Legacy Prisma export (will fail if Prisma binary not available)
let prisma: import("@prisma/client").PrismaClient | null = null;

try {
  const { PrismaClient } = require("@prisma/client");
  const globalForPrisma = global as unknown as {
    prisma: import("@prisma/client").PrismaClient | undefined;
  };
  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} catch {
  console.log("[DB] Prisma client not available, using pg pool directly");
}

export { prisma };
