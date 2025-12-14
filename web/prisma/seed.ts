import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create departments
  const salesDept = await prisma.department.upsert({
    where: { name: "営業部" },
    update: {},
    create: { name: "営業部" },
  });

  const supportDept = await prisma.department.upsert({
    where: { name: "サポート部" },
    update: {},
    create: { name: "サポート部" },
  });

  const itDept = await prisma.department.upsert({
    where: { name: "情報システム部" },
    update: {},
    create: { name: "情報システム部" },
  });

  console.log("Departments created");

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "管理者",
      password: hashedPassword,
      role: "ADMIN",
      departmentId: itDept.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "operator@example.com" },
    update: {},
    create: {
      email: "operator@example.com",
      name: "山田太郎",
      password: hashedPassword,
      role: "OPERATOR",
      departmentId: salesDept.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "auditor@example.com" },
    update: {},
    create: {
      email: "auditor@example.com",
      name: "監査担当",
      password: hashedPassword,
      role: "AUDITOR",
      departmentId: supportDept.id,
    },
  });

  console.log("Users created");

  // Create sample documents
  const documents = [
    {
      title: "口座開設手続きマニュアル",
      category: "MANUAL" as const,
      content: `# 口座開設手続きマニュアル

## 1. 必要書類
- 本人確認書類（運転免許証、パスポート、マイナンバーカード等）
- 印鑑
- 初期入金額（最低1,000円）

## 2. 手続きの流れ
1. 申込書の記入
2. 本人確認書類の提示
3. 印鑑登録
4. 初期入金
5. キャッシュカード発行（約1週間）

## 3. 注意事項
- 18歳未満の方は親権者の同意が必要です
- 反社会的勢力との関係がないことの確認が必要です
- マイナンバーの届出が必要です

## 4. よくある質問
Q: 口座開設にかかる時間は？
A: 窓口での手続きは約30分です。キャッシュカードは約1週間で届きます。

Q: 代理人による申込は可能ですか？
A: 原則本人による申込が必要です。やむを得ない事情がある場合は事前にご相談ください。`,
      filePath: "/documents/manual/account-opening.md",
      version: "2.1",
      confidentiality: "INTERNAL" as const,
      tags: ["口座開設", "マニュアル", "窓口業務"],
      createdBy: "system",
    },
    {
      title: "融資審査基準規程",
      category: "REGULATION" as const,
      content: `# 融資審査基準規程

## 第1条（目的）
本規程は、融資審査における基準を定め、適正かつ公平な融資判断を行うことを目的とする。

## 第2条（審査項目）
融資審査においては、以下の項目を確認する。
1. 返済能力
2. 信用情報
3. 担保評価
4. 事業計画（事業者の場合）

## 第3条（返済能力の判定）
返済能力は以下の基準で判定する。
- 返済比率：年間返済額が年収の35%以内
- 勤続年数：原則2年以上
- 雇用形態：正社員を優先

## 第4条（信用情報の確認）
信用情報機関への照会を必須とし、以下を確認する。
- 延滞履歴の有無
- 他社借入状況
- 破産・債務整理の履歴

## 第5条（担保評価）
不動産担保の場合、時価の70%を上限とする。`,
      filePath: "/documents/regulation/loan-criteria.md",
      version: "3.0",
      confidentiality: "CONFIDENTIAL" as const,
      tags: ["融資", "審査基準", "規程"],
      createdBy: "system",
    },
    {
      title: "よくある問い合わせFAQ",
      category: "FAQ" as const,
      content: `# よくある問い合わせFAQ

## 口座関連

### Q1: 通帳を紛失しました。どうすればいいですか？
A: 最寄りの支店窓口にて再発行手続きを行ってください。本人確認書類と届出印が必要です。再発行手数料は1,100円（税込）です。

### Q2: 住所変更の手続き方法を教えてください。
A: 以下の方法で手続き可能です。
- インターネットバンキング
- 電話バンキング
- 窓口（届出印が必要）

### Q3: キャッシュカードの暗証番号を忘れました。
A: 窓口にて暗証番号の再設定が必要です。本人確認書類をお持ちください。

## 振込関連

### Q4: 振込手数料はいくらですか？
A:
- 当行宛：無料
- 他行宛（3万円未満）：220円
- 他行宛（3万円以上）：440円
※インターネットバンキングは上記より110円割引

### Q5: 振込の取消はできますか？
A: 振込完了後の取消はできません。組戻し手続き（手数料880円）が必要です。

## ローン関連

### Q6: 住宅ローンの繰上返済はできますか？
A: 可能です。窓口またはインターネットバンキングから手続きできます。手数料は繰上返済額の0.5%（最低5,500円）です。`,
      filePath: "/documents/faq/general-faq.md",
      version: "1.5",
      confidentiality: "INTERNAL" as const,
      tags: ["FAQ", "問い合わせ", "口座", "振込", "ローン"],
      createdBy: "system",
    },
  ];

  for (const doc of documents) {
    await prisma.document.upsert({
      where: { id: doc.title },
      update: {},
      create: doc,
    });
  }

  console.log("Sample documents created");
  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
