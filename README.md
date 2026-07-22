# BeEngineer LP - 仕様書 & ローカル起動ガイド

## 📊 サイト内 UI・リンク対応表

### 1. 共通ヘッダー（3ページ共通）

| UI要素 | index.html | student.html | teacher.html |
| :--- | :--- | :--- | :--- |
| **ロゴ** | `index.html` | `index.html` | `index.html` |
| **ナビ「トップ」** | `index.html` ★現在地 | `index.html` | `index.html` |
| **ナビ「スクール紹介」** | `student.html` | `student.html` ★現在地 | `student.html` |
| **ナビ「学校連携」** | `teacher.html` | `teacher.html` | `teacher.html` ★現在地 |
| **右上CTAボタン** | 「無料体験に申し込む」→ LP | 「お問い合わせ」→ `teacher.html#contact` | 「お問い合わせ」→ `teacher.html#contact` |
| **ハンバーガー** | `#menu-btn` → `#mobile-nav` 開閉 | 同左 | 同左 |

> ⚠️ **不整合**
> ヘッダーCTAがページごとに異なっています（`index` だけ「無料体験」、他2ページは「お問い合わせ」）。  
> モバイルナビは3ページとも「無料体験」で統一されているため、PC/モバイルで挙動が食い違います。

---

### 2. モバイルナビ（3ページ共通・統一済み）

* トップ (`index.html`)
* スクール紹介（受講生・保護者の方） (`student.html`)
* 学校連携（学校関係者の方） (`teacher.html`)
* 無料体験に申し込む（LP・別タブ）

---

### 3. index.html

| 位置 | ラベル | リンク先 |
| :--- | :--- | :--- |
| **Hero** | 無料体験に申し込む | LP `summer_2026.html#schedule-cta` |
| **Hero** | 学校関係者の方へ | `teacher.html` |
| **About** | スクール紹介を見る | `student.html` |
| **Showcase 最終カード** | 無料体験に申し込む | LP |
| **For Schools** | 学校連携を見る | `teacher.html` |
| **News 一覧へ** | — | `be-engineer.tech/news-list` |
| **News 3件** | 各記事 | `/news-list/23`, `/news-list/22`, `/news-list/19` |

* **セクションID:** `#top`, `#hero`, `#showcase`, `#schools`, `#news`
* **3D要素:** `#bridge-canvas`

---

### 4. student.html

| 位置 | ラベル | リンク先 |
| :--- | :--- | :--- |
| **Hero** | 講座内容を見る | `#curriculum` |
| **Hero** | 生徒の声を読む | `#voices` |
| **校舎一覧 (6校)** | 各校舎詳細 | `be-engineer.tech/school-detail/1, 2, 3, 5, 6, 7` |
| **下部CTA** | 無料体験 | LP |

* **セクションID:** `#top`, `#concept`, `#curriculum`, `#system`, `#voices`, `#schools`
> ⚠️ `school-detail/4` が欠番です（意図的な設定でない場合は要確認）。

---

### 5. teacher.html

| 位置 | ラベル | リンク先 |
| :--- | :--- | :--- |
| **Hero** | 導入を相談する | `#contact` |
| **Hero** | プログラムを見る | `#program` |
| **Contact** | お問い合わせフォーム | `#` （未設定） |
| **Contact** | 資料をダウンロード | `#` （未設定） |
| **下部CTA** | 無料体験 | LP |

* **セクションID:** `#top`, `#about`, `#program`, `#flow`, `#cases`, `#faq`, `#contact`
> ⚠️ `#faq`, `#flow`, `#cases`, `#about` はページ内にIDが存在するものの、移動するための導線リンクがありません。

---

### 6. 共通フッター（3ページ共通）

| ブロック | 状態 |
| :--- | :--- |
| **SNS 4種**<br>(Instagram / YouTube / TikTok / X) | ・`index.html`: 3つが `be-engineer.tech/` トップ、X は `#`<br>・`student.html` / `teacher.html`: 4つとも `#` |
| **News 3件** | 3ページとも全て `#` |
| **Site Map** | `index.html`, `student.html`, `teacher.html` + LP (正常) |

---

### 7. 要修正リスト

* **未設定リンクの修正（`#` のままになっている要素）**
  * フッターSNS 全4種 × 3ページ（index の3つも公式トップ止まりのため詳細へ）
  * フッターNews 3件 × 3ページ
  * `teacher.html` の「お問い合わせフォーム」および「資料をダウンロード」

---

## 🚀 ローカルサーバー起動ガイド

本プロジェクトで使用している3Dロゴ（Three.js + SVGLoader）は、ブラウザのセキュリティ制限（CORS）のため、HTMLファイルを直接ダブルクリックで開くと正常に表示されません。

本来のアニメーションを確認するには、以下のいずれかの方法でローカルサーバーを起動し、`http://localhost...` 経由でアクセスしてください。

### ローカルサーバー起動コマンド

プロジェクトのルートディレクトリ（`index.html` があるフォルダ）で実行してください。

#### 1. Python (推奨・インストール不要)

```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000