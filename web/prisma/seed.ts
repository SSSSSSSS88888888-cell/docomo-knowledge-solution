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
    {
      title: "コンプライアンス基本規程",
      category: "REGULATION" as const,
      content: `# コンプライアンス基本規程

## 第1条（目的）
本規程は、当行の役職員が遵守すべきコンプライアンスの基本事項を定め、法令等遵守の徹底を図ることを目的とする。

## 第2条（定義）
コンプライアンスとは、法令、規則、社内規程、社会規範及び企業倫理を遵守することをいう。

## 第3条（基本方針）
1. 法令・規則の遵守
2. 社会的責任の履行
3. 顧客保護の徹底
4. 反社会的勢力との関係遮断

## 第4条（禁止行為）
以下の行為を禁止する。
- インサイダー取引
- 利益相反取引
- 優越的地位の濫用
- 個人情報の不正利用
- マネーロンダリング

## 第5条（報告義務）
コンプライアンス違反を発見した場合は、直ちにコンプライアンス部門に報告しなければならない。

## 第6条（内部通報制度）
コンプライアンス違反に関する相談・通報窓口を設置する。
- 内部通報ホットライン：内線9999
- 外部通報窓口：compliance@example.com`,
      filePath: "/documents/regulation/compliance.md",
      version: "4.0",
      confidentiality: "INTERNAL" as const,
      tags: ["コンプライアンス", "法令遵守", "規程"],
      createdBy: "system",
    },
    {
      title: "情報セキュリティポリシー",
      category: "GUIDELINE" as const,
      content: `# 情報セキュリティポリシー

## 1. 基本方針
当行は、お客様の大切な情報資産を保護するため、情報セキュリティの確保を経営の最重要課題と位置付ける。

## 2. 適用範囲
本ポリシーは、当行の全役職員及び業務委託先に適用する。

## 3. パスワード管理
- 8文字以上で英数字・記号を含む
- 90日ごとに変更
- 他者との共有禁止
- メモに記載しない

## 4. メール利用規則
- 個人情報を含むファイルは暗号化
- 不審なメールの添付ファイルは開かない
- 私用メールアドレスへの転送禁止

## 5. インシデント対応
セキュリティインシデント発生時の対応手順：
1. 情報システム部に即時報告（内線8888）
2. 被害拡大防止措置の実施
3. 原因調査と再発防止策の策定
4. 関係者への報告

## 6. 物理的セキュリティ
- 入退室記録の管理
- クリアデスク・クリアスクリーンの徹底
- 機密文書のシュレッダー処理`,
      filePath: "/documents/guideline/security-policy.md",
      version: "2.5",
      confidentiality: "INTERNAL" as const,
      tags: ["セキュリティ", "情報管理", "ガイドライン"],
      createdBy: "system",
    },
    {
      title: "クレジットカード利用規約",
      category: "REGULATION" as const,
      content: `# クレジットカード利用規約

## 第1条（カードの貸与）
カードは会員本人のみが利用でき、他人への貸与・譲渡は禁止する。

## 第2条（利用限度額）
利用限度額は審査により決定し、以下を標準とする。
- 一般カード：30万円〜100万円
- ゴールドカード：100万円〜300万円
- プラチナカード：300万円以上

## 第3条（支払方法）
- 一括払い：手数料無料
- 分割払い（3回以上）：実質年率12.0%〜15.0%
- リボルビング払い：実質年率15.0%

## 第4条（ポイントプログラム）
- 利用額100円につき1ポイント付与
- 1ポイント＝1円として利用可能
- ポイント有効期限：獲得から2年間

## 第5条（紛失・盗難時の対応）
カードの紛失・盗難時は直ちに以下に連絡すること。
- 紛失盗難デスク：0120-XXX-XXX（24時間対応）
届出前60日以内、届出後60日以内の不正利用は補償対象。

## 第6条（解約）
退会を希望する場合は、カードデスクに連絡の上、カードを返却すること。`,
      filePath: "/documents/regulation/credit-card-terms.md",
      version: "5.2",
      confidentiality: "PUBLIC" as const,
      tags: ["クレジットカード", "利用規約", "ポイント"],
      createdBy: "system",
    },
    {
      title: "相続手続きガイド",
      category: "MANUAL" as const,
      content: `# 相続手続きガイド

## 1. 相続発生時の届出
口座名義人がお亡くなりになった場合、速やかに届出をお願いします。
届出後、口座は相続手続き完了まで凍結されます。

## 2. 必要書類
### 必須書類
- 被相続人の戸籍謄本（出生から死亡まで）
- 相続人全員の戸籍謄本
- 相続人全員の印鑑証明書
- 遺産分割協議書（相続人全員の署名・実印）

### 遺言書がある場合
- 遺言書（公正証書遺言または検認済み自筆証書遺言）
- 遺言執行者の本人確認書類

## 3. 手続きの流れ
1. 相続届の提出
2. 残高証明書の発行（手数料770円）
3. 必要書類の提出
4. 相続預金の払戻し

## 4. 所要期間
書類不備がなければ、提出から約2週間で手続き完了。

## 5. よくある質問
Q: 相続人の一人が海外在住の場合は？
A: 在外公館で発行されるサイン証明書と在留証明書が必要です。

Q: 遺産分割協議がまとまらない場合は？
A: 法定相続分での仮払い制度（上限150万円）をご利用いただけます。`,
      filePath: "/documents/manual/inheritance-guide.md",
      version: "1.3",
      confidentiality: "INTERNAL" as const,
      tags: ["相続", "手続き", "マニュアル"],
      createdBy: "system",
    },
    {
      title: "外国為替取引マニュアル",
      category: "MANUAL" as const,
      content: `# 外国為替取引マニュアル

## 1. 外貨預金
### 取扱通貨
米ドル、ユーロ、英ポンド、豪ドル、NZドル、カナダドル、スイスフラン

### 為替手数料
- 米ドル：1円/ドル
- ユーロ：1.5円/ユーロ
- その他：通貨により異なる

### 金利（年利・税引前）
- 米ドル：4.5%
- ユーロ：2.0%
※金利は変動します

## 2. 海外送金
### 送金手数料
- 電信送金：4,000円
- 送金小切手：2,500円

### 必要情報
- 受取人名（英字）
- 受取銀行名・支店名
- SWIFTコード
- 口座番号（IBAN）
- 送金目的

### 注意事項
- 100万円超の送金は報告義務あり
- 北朝鮮・イラン向け送金は原則禁止
- マネーロンダリング防止のため本人確認を厳格に実施

## 3. 外貨両替
窓口での外貨現金の両替が可能です。
- 両替上限：1日50万円相当
- レート更新：1日1回（午前10時）`,
      filePath: "/documents/manual/forex-guide.md",
      version: "3.1",
      confidentiality: "INTERNAL" as const,
      tags: ["外国為替", "外貨預金", "海外送金"],
      createdBy: "system",
    },
    {
      title: "投資信託販売ガイドライン",
      category: "GUIDELINE" as const,
      content: `# 投資信託販売ガイドライン

## 1. 適合性の原則
お客様の投資目的、財産状況、投資経験に適した商品を提案すること。

## 2. 顧客属性の確認
### 確認事項
- 投資目的（資産形成、退職後資金、教育資金等）
- 投資経験（株式、投資信託、債券等）
- 金融資産額
- 年収
- リスク許容度

## 3. 重要事項説明
以下の事項を必ず説明すること。
- 元本保証がないこと
- 基準価額の変動リスク
- 為替リスク（外貨建ての場合）
- 信託報酬等のコスト
- クーリングオフ制度の適用外であること

## 4. 高齢者への販売
70歳以上のお客様への販売時は、以下を遵守すること。
- 複数回の面談による意思確認
- 家族の同席推奨
- ハイリスク商品の販売制限

## 5. 禁止事項
- 元本保証の約束
- 過度な乗換勧誘
- 断定的判断の提供
- 虚偽説明

## 6. アフターフォロー
販売後も定期的にポートフォリオの状況を報告し、必要に応じて見直しを提案すること。`,
      filePath: "/documents/guideline/investment-trust.md",
      version: "2.0",
      confidentiality: "INTERNAL" as const,
      tags: ["投資信託", "販売", "ガイドライン", "適合性"],
      createdBy: "system",
    },
  ];

  for (const doc of documents) {
    // Use create instead of upsert since we don't have a unique constraint on title
    const existingDoc = await prisma.document.findFirst({
      where: { title: doc.title },
    });

    if (!existingDoc) {
      await prisma.document.create({
        data: doc,
      });
    }
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
