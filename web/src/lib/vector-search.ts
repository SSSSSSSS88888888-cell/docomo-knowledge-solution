import { pool } from "./db";
import { generateEmbedding, splitIntoChunks } from "./embeddings";

export interface SimilarChunk {
  documentId: string;
  documentTitle: string;
  content: string;
  score: number;
}

export async function searchSimilarChunks(
  query: string,
  limit: number = 5
): Promise<SimilarChunk[]> {
  const queryEmbedding = await generateEmbedding(query);
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  const result = await pool.query(
    `SELECT
      dc.id,
      dc."documentId",
      dc.content,
      d.title as "documentTitle",
      1 - (dc.embedding <=> $1::vector) as score
    FROM "DocumentChunk" dc
    JOIN "Document" d ON dc."documentId" = d.id
    WHERE d."isActive" = true
      AND dc.embedding IS NOT NULL
    ORDER BY dc.embedding <=> $1::vector
    LIMIT $2`,
    [embeddingStr, limit]
  );

  return result.rows.map((r: { documentId: string; documentTitle: string; content: string; score: number }) => ({
    documentId: r.documentId,
    documentTitle: r.documentTitle,
    content: r.content,
    score: Number(r.score),
  }));
}

export async function indexDocument(
  documentId: string,
  content: string
): Promise<void> {
  // Delete existing chunks for this document
  await pool.query(
    `DELETE FROM "DocumentChunk" WHERE "documentId" = $1`,
    [documentId]
  );

  // Split content into chunks
  const chunks = splitIntoChunks(content, 500);

  // Create chunks with embeddings
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i]);
    const embeddingStr = `[${embedding.join(",")}]`;

    await pool.query(
      `INSERT INTO "DocumentChunk" (id, "documentId", content, "chunkIndex", embedding, "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4::vector, NOW())`,
      [documentId, chunks[i], i, embeddingStr]
    );
  }
}
