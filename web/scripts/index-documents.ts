import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function splitIntoChunks(text: string, chunkSize: number = 500): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = "";

  for (const para of paragraphs) {
    if (currentChunk.length + para.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + para;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

async function indexDocument(documentId: string, content: string): Promise<void> {
  // Delete existing chunks for this document
  await prisma.documentChunk.deleteMany({
    where: { documentId },
  });

  // Split content into chunks
  const chunks = splitIntoChunks(content, 500);

  console.log(`  Creating ${chunks.length} chunks...`);

  // Create chunks with embeddings
  for (let i = 0; i < chunks.length; i++) {
    console.log(`  Generating embedding for chunk ${i + 1}/${chunks.length}...`);
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

async function main() {
  console.log("Starting document indexing...\n");

  // Get all active documents
  const documents = await prisma.document.findMany({
    where: { isActive: true },
  });

  console.log(`Found ${documents.length} documents to index.\n`);

  for (const doc of documents) {
    console.log(`Indexing: ${doc.title}`);
    try {
      await indexDocument(doc.id, doc.content);
      console.log(`  ✓ Done\n`);
    } catch (error) {
      console.error(`  ✗ Error: ${error}\n`);
    }
  }

  console.log("Document indexing completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
