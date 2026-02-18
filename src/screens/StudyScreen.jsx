import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardBody } from '../components/common/Card';

const STUDY_CONTENT = {
  'アルゴリズムとプログラミング': {
    sections: [
      {
        title: 'アルゴリズムの基礎',
        content: `アルゴリズムとは、問題を解くための手順（手続き）を有限の手順で明確に記述したものです。

**アルゴリズムの条件:**
- 有限性：必ず有限のステップで終了する
- 確定性：各ステップが明確に定義されている
- 入出力：0個以上の入力と1個以上の出力がある`,
      },
      {
        title: '主なソートアルゴリズム',
        content: `**バブルソート** O(n²)
隣接する要素を比較して大きい方を後ろに移動。理解しやすいが非効率。

**選択ソート** O(n²)
未ソート部分の最小値を選んで先頭と交換。

**挿入ソート** O(n²)（最良 O(n)）
整列済み部分に適切な位置を見つけて挿入。ほぼ整列済みのデータに強い。

**クイックソート** 平均 O(n log n)、最悪 O(n²)
ピボットで分割して再帰的にソート。実用的に高速。

**マージソート** O(n log n)
分割統治。安定ソート。追加メモリが必要。`,
      },
      {
        title: '計算量（オーダー記法）',
        content: `アルゴリズムの効率はオーダー記法（ビッグオー記法）で表します。

- O(1)：定数時間（ハッシュテーブルの検索）
- O(log n)：対数時間（二分探索）
- O(n)：線形時間（線形探索）
- O(n log n)：線形対数（クイックソート平均）
- O(n²)：二乗時間（バブルソート）

**小さいほど効率が良い:** O(1) < O(log n) < O(n) < O(n log n) < O(n²)`,
      },
      {
        title: 'データ構造',
        content: `**スタック（Stack）：LIFO（後入れ先出し）**
プッシュ（追加）・ポップ（取出し）操作。
例：関数呼び出しの管理、undo機能

**キュー（Queue）：FIFO（先入れ先出し）**
エンキュー（追加）・デキュー（取出し）操作。
例：プリントキュー、BFS（幅優先探索）

**木（Tree）**
ノードと枝から成る階層構造。
二分探索木：左<根<右の性質を持つ。検索O(log n)。

**ハッシュテーブル**
キーをハッシュ関数で変換してインデックスを決定。平均O(1)で検索。`,
      },
    ],
  },
  'コンピュータ構成要素（CPU・メモリ・入出力）': {
    sections: [
      {
        title: 'CPU（中央処理装置）',
        content: `CPUはコンピュータの頭脳です。

**主な構成要素:**
- 演算装置（ALU）：算術・論理演算を実行
- 制御装置：命令の解釈・実行制御
- レジスタ：高速な一時記憶（最も高速）
- キャッシュメモリ：L1/L2/L3階層

**CPUの性能指標:**
- クロック周波数（GHz）：1秒あたりのクロック数
- CPI（Cycles Per Instruction）：1命令あたりのクロック数
- MIPS = クロック周波数 / CPI`,
      },
      {
        title: 'メモリ階層',
        content: `メモリは速度と容量のトレードオフがあります。

速度（速い）↓  容量（小さい）↓
レジスタ
キャッシュメモリ（SRAM：L1/L2/L3）
主記憶（RAM：DRAM）
補助記憶（SSD/HDD）
速度（遅い）↓  容量（大きい）↓

**SRAM vs DRAM:**
- SRAM：高速・フリップフロップ・リフレッシュ不要（キャッシュに使用）
- DRAM：低速・キャパシタ・リフレッシュ必要（主記憶に使用）`,
      },
    ],
  },
  'ネットワーク': {
    sections: [
      {
        title: 'OSI参照モデルとTCP/IP',
        content: `**OSI参照モデル（7層）:**
第7層：アプリケーション層（HTTP, FTP, SMTP）
第6層：プレゼンテーション層（暗号化、文字コード）
第5層：セッション層（通信の確立・管理）
第4層：トランスポート層（TCP, UDP）
第3層：ネットワーク層（IP、ルーター）
第2層：データリンク層（MACアドレス、スイッチ）
第1層：物理層（ケーブル、電気信号）

**TCP vs UDP:**
- TCP：信頼性あり、順序保証、再送あり（Web, メール）
- UDP：高速、送達確認なし（動画配信、ゲーム）`,
      },
      {
        title: 'IPアドレスとサブネット',
        content: `**IPv4：32ビット（約43億個）**
クラスA：10.0.0.0〜10.255.255.255（/8）
クラスB：172.16.0.0〜172.31.255.255（/12）
クラスC：192.168.0.0〜192.168.255.255（/16）

**CIDR表記:** 192.168.1.0/24
/24 = 先頭24ビットがネットワーク部
サブネットマスク = 255.255.255.0
ホスト数 = 2^(32-24) - 2 = 254台

**IPv6：128ビット（膨大なアドレス数）**
NATが不要になり、エンドツーエンドの通信が可能。`,
      },
    ],
  },
  'セキュリティ': {
    sections: [
      {
        title: '情報セキュリティの基礎',
        content: `**情報セキュリティのCIA三要素:**
- 機密性（Confidentiality）：許可された者だけがアクセス可能
- 完全性（Integrity）：データが正確・改ざんされていない
- 可用性（Availability）：必要な時にサービスが使える

**主な脅威:**
- マルウェア（ウイルス・ランサムウェア・スパイウェア）
- フィッシング詐欺
- DoS/DDoS攻撃
- SQLインジェクション
- XSS（クロスサイトスクリプティング）`,
      },
      {
        title: '暗号化技術',
        content: `**共通鍵暗号方式（対称暗号）:**
暗号化と復号に同じ鍵を使用。高速だが鍵配送問題あり。
例：AES、DES

**公開鍵暗号方式（非対称暗号）:**
公開鍵で暗号化 → 秘密鍵で復号。
鍵配送問題を解決。低速。
例：RSA、楕円曲線暗号

**ハイブリッド方式（TLS/SSL）:**
公開鍵暗号で共通鍵を安全に交換し、
実際のデータは共通鍵暗号で高速暗号化。

**デジタル署名:**
秘密鍵で署名 → 公開鍵で検証。
「なりすまし防止」と「改ざん検知」に使用。`,
      },
    ],
  },
  'データベース': {
    sections: [
      {
        title: 'データベースの基礎',
        content: `**関係データベース（RDB）の基本概念:**
- テーブル（表）：行（レコード）と列（カラム）
- 主キー：行を一意に識別する列
- 外部キー：他テーブルの主キーを参照（参照整合性）
- インデックス：検索高速化（検索O(log n)→ O(1)に近い）

**ACID特性:**
- 原子性（Atomicity）：全か無か
- 一貫性（Consistency）：整合性維持
- 独立性（Isolation）：並列実行の分離
- 耐久性（Durability）：コミット後の永続化`,
      },
      {
        title: 'SQL基礎',
        content: `**DML（データ操作言語）:**
SELECT：データ取得
INSERT：データ挿入
UPDATE：データ更新
DELETE：データ削除

**基本的なSELECT文:**
SELECT 列名 FROM テーブル名
WHERE 条件
GROUP BY 列名
HAVING グループ条件
ORDER BY 列名 ASC/DESC

**JOIN（結合）:**
INNER JOIN：一致する行のみ
LEFT JOIN：左テーブルの全行 + 一致する右テーブルの行
RIGHT JOIN：右テーブルの全行 + 一致する左テーブルの行`,
      },
    ],
  },
};

const DEFAULT_CONTENT = {
  sections: [
    {
      title: 'この分野の学習ポイント',
      content: `この分野の解説は準備中です。

問題演習を通じて実践的に学習することをお勧めします。

**基本情報技術者試験での学習のコツ:**
- 過去問を繰り返し解くことが最も効果的
- 解説をしっかり読んで理解する
- 弱点分野を集中的に学習する
- 公式テキストや参考書と併用する`,
    },
  ],
};

export function StudyScreen({ params = {}, onNavigate }) {
  const { markTopicComplete } = useApp();
  const topicName = params.topicName || '';
  const content = STUDY_CONTENT[topicName] || DEFAULT_CONTENT;

  function handleComplete() {
    if (params.topicId) {
      markTopicComplete(params.topicId);
    }
    onNavigate('syllabus');
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('syllabus')}>← シラバス</Button>
        <div>
          <h1 className="font-bold text-gray-800 dark:text-gray-100">{topicName || '学習モード'}</h1>
          <p className="text-xs text-gray-500">学習モード</p>
        </div>
      </div>

      {content.sections.map((section, i) => (
        <Card key={i}>
          <CardHeader>
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">{section.title}</h2>
          </CardHeader>
          <CardBody>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {section.content.split('\n').map((line, j) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={j} className="font-semibold text-gray-800 dark:text-gray-100 mt-3 mb-1">{line.slice(2, -2)}</p>;
                }
                if (line.startsWith('- ')) {
                  return <p key={j} className="text-sm text-gray-700 dark:text-gray-300 pl-4 before:content-['•'] before:mr-2">{line.slice(2)}</p>;
                }
                if (line === '') {
                  return <div key={j} className="h-2" />;
                }
                return <p key={j} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{line}</p>;
              })}
            </div>
          </CardBody>
        </Card>
      ))}

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={handleComplete}
          className="w-full"
        >
          学習完了にする ✓
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => onNavigate('quiz', { subcategory: topicName })}
          className="w-full"
        >
          この分野の問題を解く →
        </Button>
      </div>
    </div>
  );
}
