# CLAUDE.md - AIナレッジ統合型業務支援Webプラットフォーム

## プロジェクト概要

金融機関向けの社内ナレッジ検索システム。RAG（Retrieval-Augmented Generation）を活用し、業務規程・マニュアル・FAQを横断検索してAIが根拠付きで回答する。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Next.js API Routes + Python FastAPI（AI処理）
- **データベース**: PostgreSQL + pgvector（ベクトル検索）
- **AI**: Anthropic Claude API（回答生成）+ OpenAI Embeddings（ベクトル化）
- **認証**: NextAuth.js + JWT
- **インフラ**: Docker + docker-compose（ローカル開発）

## 開発コマンド

```bash
# Docker環境起動
docker-compose up -d

# Next.js開発
cd web
npm install
npm run dev

# Prisma
npx prisma generate
npx prisma db push
npx prisma db seed
```

## ディレクトリ構成

```
knowledge-platform/
├── CLAUDE.md                 # この指示書
├── docker-compose.yml        # ローカル開発環境
├── .env.example             # 環境変数テンプレート
│
├── web/                     # Next.js フロントエンド＋API
│   ├── src/
│   │   ├── app/             # App Router
│   │   ├── components/      # UIコンポーネント
│   │   ├── lib/             # ユーティリティ
│   │   └── types/           # 型定義
│   └── prisma/              # DBスキーマ
│
└── ai-service/              # Python FastAPI（AI処理専用）
```
