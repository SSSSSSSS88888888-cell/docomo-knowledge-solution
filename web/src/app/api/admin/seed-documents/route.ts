import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const newDocuments = [
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

export async function POST() {
  try {
    const results = [];

    for (const doc of newDocuments) {
      const existing = await prisma.document.findFirst({
        where: { title: doc.title },
      });

      if (existing) {
        results.push({ title: doc.title, status: "skipped" });
        continue;
      }

      await prisma.document.create({
        data: doc,
      });
      results.push({ title: doc.title, status: "created" });
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Error seeding documents:", error);
    return NextResponse.json(
      { error: "Failed to seed documents" },
      { status: 500 }
    );
  }
}
