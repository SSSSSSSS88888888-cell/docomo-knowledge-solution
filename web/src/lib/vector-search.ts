import { prisma } from "./db";
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

  const results = await prisma.$queryRaw<
    Array<{
      id: string;
      documentId: string;
      content: string;
      documentTitle: string;
      score: number;
    }>
  >`
    SELECT
      dc.id,
      dc."documentId",
      dc.content,
      d.title as "documentTitle",
      1 - (dc.embedding <=> ${embeddingStr}::vector) as score
    FROM "DocumentChunk" dc
    JOIN "Document" d ON dc."documentId" = d.id
    WHERE d."isActive" = true
      AND dc.embedding IS NOT NULL
    ORDER BY dc.embedding <=> ${embeddingStr}::vector
    LIMIT ${limit}
  `;

  return results.map((r) => ({
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
  await prisma.documentChunk.deleteMany({
    where: { documentId },
  });

  // Split content into chunks
  const chunks = splitIntoChunks(content, 500);

  // Create chunks with embeddings
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i]);
    const embeddingStr = `[${embedding.join(",")}]`;

    await prisma.$executeRaw`
      INSERT INTO "DocumentChunk" (id, "documentId", content, "chunkIndex", embedding, "createdAt")
      VALUES (
        gen_random_uuid(),
        ${documentId},
        ${chunks[i]},
        ${i},
        ${embeddingStr}::vector,
        NOW()
      )
    `;
  }
}
