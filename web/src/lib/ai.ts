import Anthropic from "@anthropic-ai/sdk";
import { searchSimilarChunks, SimilarChunk } from "./vector-search";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface SearchResult {
  response: string;
  sources: {
    documentId: string;
    documentTitle: string;
    excerpt: string;
    score: number;
  }[];
}

export async function generateRAGResponse(
  question: string,
  userId: string
): Promise<SearchResult> {
  // 1. Search for relevant document chunks
  const relevantChunks = await searchSimilarChunks(question, 5);

  if (relevantChunks.length === 0) {
    return {
      response:
        "申し訳ございません。ご質問に関連する文書が見つかりませんでした。\n\nキーワードを変えて再度検索いただくか、業務支援デスク（内線: 1234）へお問い合わせください。",
      sources: [],
    };
  }

  // 2. Build context from relevant chunks
  const context = relevantChunks
    .map(
      (chunk, i) => `[文書${i + 1}: ${chunk.documentTitle}]\n${chunk.content}`
    )
    .join("\n\n---\n\n");

  // 3. Generate response using Claude API
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `あなたは金融機関の業務支援AIアシスタントです。
以下のルールに従って回答してください：

1. 提供された社内文書の情報のみに基づいて回答する
2. 回答の根拠となる文書を明示する（例：「文書1によると...」）
3. 文書に記載がない内容は「該当する情報が見つかりません」と回答する
4. 専門用語は分かりやすく説明する
5. 箇条書きを使って整理された回答を心がける
6. 回答は簡潔かつ正確に`,
    messages: [
      {
        role: "user",
        content: `## 参照文書
${context}

## 質問
${question}

上記の参照文書に基づいて、質問に回答してください。回答の根拠となった文書番号も示してください。`,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  return {
    response: responseText,
    sources: relevantChunks.map((chunk) => ({
      documentId: chunk.documentId,
      documentTitle: chunk.documentTitle,
      excerpt: chunk.content.slice(0, 200) + (chunk.content.length > 200 ? "..." : ""),
      score: chunk.score,
    })),
  };
}

// Mock function for development without API keys
export async function generateMockRAGResponse(
  question: string
): Promise<SearchResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    response: `ご質問「${question}」についてお答えします。

**文書1（口座開設手続きマニュアル）** によると：
- 必要書類として、本人確認書類（運転免許証、パスポート、マイナンバーカード等）が必要です
- 印鑑と初期入金額（最低1,000円）も必要となります

**手続きの流れ：**
1. 申込書の記入
2. 本人確認書類の提示
3. 印鑑登録
4. 初期入金
5. キャッシュカード発行（約1週間）

ご不明な点がございましたら、窓口担当者または業務支援デスク（内線: 1234）までお問い合わせください。`,
    sources: [
      {
        documentId: "doc-1",
        documentTitle: "口座開設手続きマニュアル",
        excerpt:
          "必要書類として、本人確認書類（運転免許証、パスポート、マイナンバーカード等）が必要です。印鑑と初期入金額（最低1,000円）も必要となります。",
        score: 0.95,
      },
      {
        documentId: "doc-3",
        documentTitle: "よくある問い合わせFAQ",
        excerpt:
          "Q: 口座開設にかかる時間は？\nA: 窓口での手続きは約30分です。キャッシュカードは約1週間で届きます。",
        score: 0.82,
      },
    ],
  };
}
