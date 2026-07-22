# BeEngineer Tokyo — サイト内リンク総点検 報告書

> **点検日:** 2026.07.22  
> **調査対象:** `index.html` / `student.html` / `teacher.html`

---

## 📊 スコアカード (全体サマリー)

| 項目 | 件数 / 状態 |
| :--- | :--- |
| **リンク総数** | **54** 件 |
| **設定済み (OK)** | **33** 件 |
| **未設定 (Bad: `#`)** | **17** 件 |
| **要確認・不統一 (Warn)** | **4** 件 |
| **対象ページ** | **3** ページ |

---

## 🔗 リンク詳細点検表

### 1. 共通ヘッダー（3ページ共通）
> ⚠️ **注意:** PCとモバイルでCTAボタンの導線が不一致です。

| 設置ページ | UI要素 | 遷移先 | 状態 |
| :--- | :--- | :--- | :--- |
| **全ページ** | ロゴ | [`index.html`](https://be-engineer.tech/) | 🟢 OK |
| **全ページ** | ナビ 3項目<br>`(トップ / スクール紹介 / 学校連携)` | `index.html` / `student.html` / `teacher.html` | 🟢 OK |
| **index** | 右上CTA「無料体験に申し込む」 | [LP summer_2026](https://lp.be-engineer.tech/pages/summer_2026.html?utm_source=toppage&utm_medium=referral#schedule-cta) | 🟡 不統一 |
| **student / teacher** | 右上CTA「お問い合わせ」 | `teacher.html#contact` | 🟡 不統一 |
| **全ページ** | モバイルナビ CTA<br>`(3ページとも「無料体験」で統一)` | [LP summer_2026](https://lp.be-engineer.tech/pages/summer_2026.html?utm_source=toppage&utm_medium=referral#schedule-cta) | 🟢 OK |

---

### 2. index.html（トップページ）
> 本文内のリンクはすべて設定済みです。

| セクション | UI要素 | 遷移先 | 状態 |
| :--- | :--- | :--- | :--- |
| **Hero** | 無料体験に申し込む | [LP summer_2026](https://lp.be-engineer.tech/pages/summer_2026.html?utm_source=toppage&utm_medium=referral#schedule-cta) | 🟢 OK |
| **Hero** | 学校関係者の方へ | `teacher.html` | 🟢 OK |
| **About** | スクール紹介を見る | `student.html` | 🟢 OK |
| **Showcase** | 最終カード CTA「きみの最初のプロダクトを。」 | [LP summer_2026](https://lp.be-engineer.tech/pages/summer_2026.html?utm_source=toppage&utm_medium=referral#schedule-cta) | 🟢 OK |
| **For Schools** | 学校連携を見る | `teacher.html` | 🟢 OK |
| **News** | 一覧へ | [`be-engineer.tech/news-list`](https://be-engineer.tech/news-list) | 🟢 OK |
| **News** | 2026.01.25 新規生徒募集 | [`news-list/23`](https://be-engineer.tech/news-list/23) | 🟢 OK |
| **News** | 2025.12.17 合宿報告 | [`news-list/22`](https://be-engineer.tech/news-list/22) | 🟢 OK |
| **News** | 2023.02.21 同志社中学 | [`news-list/19`](https://be-engineer.tech/news-list/19) | 🟢 OK |

---

### 3. student.html（スクール紹介）
> 校舎ID `/4` のみ欠番となっています。

| セクション | UI要素 | 遷移先 | 状態 |
| :--- | :--- | :--- | :--- |
| **Hero** | 講座内容を見る | `#curriculum` (同一ページ内) | 🟢 OK |
| **Hero** | 生徒の声を読む | `#voices` (同一ページ内) | 🟢 OK |
| **Schools** | 京大本校 | [`school-detail/1`](https://be-engineer.tech/school-detail/1) | 🟢 OK |
| **Schools** | 梅田校 | [`school-detail/2`](https://be-engineer.tech/school-detail/2) | 🟢 OK |
| **Schools** | 東京飯田橋校 | [`school-detail/3`](https://be-engineer.tech/school-detail/3) | 🟢 OK |
| **Schools** | 横浜校 | [`school-detail/5`](https://be-engineer.tech/school-detail/5) | 🟡 要確認<br>(`/4`を飛ばして`/5`) |
| **Schools** | 秋葉原校 | [`school-detail/6`](https://be-engineer.tech/school-detail/6) | 🟢 OK |
| **Schools** | 沖縄首里校 | [`school-detail/7`](https://be-engineer.tech/school-detail/7) | 🟢 OK |
| **下部CTA** | 無料体験に申し込む | [LP summer_2026](https://lp.be-engineer.tech/pages/summer_2026.html?utm_source=toppage&utm_medium=referral#schedule-cta) | 🟢 OK |

---

### 4. teacher.html（学校連携）
> 問い合わせ等の重要導線が未接続です。

| セクション | UI要素 | 遷移先 | 状態 |
| :--- | :--- | :--- | :--- |
| **Hero** | 導入を相談する | `#contact` (同一ページ内) | 🟢 OK |
| **Hero** | プログラムを見る | `#program` (同一ページ内) | 🟢 OK |
| **Contact** | お問い合わせフォーム | 未設定 `#` (準備中の注記あり) | 🔴 未設定 |
| **Contact** | 資料をダウンロード | 未設定 `#` (準備中の注記あり) | 🔴 未設定 |
| **下部CTA** | 無料体験に申し込む | [LP summer_2026](https://lp.be-engineer.tech/pages/summer_2026.html?utm_source=toppage&utm_medium=referral#schedule-cta) | 🟢 OK |
| **全体** | `#about` / `#flow` / `#cases` / `#faq` | 導線なし (IDはあるが飛ぶリンクが無い) | 🟡 要確認 |

---

### 5. 共通フッター（3ページ共通）
> 未設定・仮設定が最も集中している箇所です。

| 設置ページ | UI要素 | 遷移先 | 状態 |
| :--- | :--- | :--- | :--- |
| **index** | Instagram / YouTube / TikTok | [`be-engineer.tech/`](https://be-engineer.tech/) (トップ止まり) | 🔴 仮設定 |
| **index** | X（旧Twitter） | 未設定 `#` | 🔴 未設定 |
| **student / teacher** | SNS 4種<br>`(Instagram / YouTube / TikTok / X)` | 未設定 `#` (計8件) | 🔴 未設定 |
| **全ページ** | News 3件<br>`(2026.07 / 2026.06 / 2026.05)` | 未設定 `#` (3ページ × 3件 = 計9件) | 🔴 未設定 |
| **全ページ** | Site Map 4項目<br>`(トップ / スクール紹介 / 学校連携 / 無料体験)` | `index.html` / `student.html` / `teacher.html` + LP | 🟢 OK |

---

## 🛠️ 対応が必要な項目 (タスク一覧)

### 01. フッターSNSのリンク先確定 `[優先度: 高]`
* **状況:** `index` のSNSリンクが公式トップ止まり、`student` / `teacher` のSNSリンクが未設定（`#`）になっています。
* **対応:** 公式 Instagram / YouTube / TikTok / X の各アカウントURLを用意し、3ページ分（計11箇所）を一括差し替えします。

### 02. フッターNews 3件のリンク先確定 `[優先度: 高]`
* **状況:** フッターに掲載されているニュース3件（2026.07 / 06 / 05）のリンク先がすべて `#` です。
* **対応:** 対応する `news-list` の記事IDを指定し、リンクを接続します（計9箇所）。

### 03. teacher.html の問い合わせフォーム・資料DL接続 `[優先度: 高]`
* **状況:** 「導入を相談する」で辿り着く最終地点（フォーム・資料DL）が未設定です。
* **対応:** 学校関係者からの問い合わせを受け取るためのフォームURLと、資料PDFの配置URLをセットします。

### 04. ヘッダーCTA文言・導線の統一 `[優先度: 中]`
* **状況:** PCヘッダーは `index` が「無料体験」、`student` / `teacher` が「お問い合わせ」となっていますが、モバイルナビは全ページ「無料体験」になっています。
* **対応:** 画面幅やページ遷移によってゴール（CTA）が変わらないよう、全ページ統一かページ別出し分けかの仕様方針を確定します。

### 05. teacher.html 下層セクションへの導線確保 `[優先度: 中]`
* **状況:** ページ内に `#about`, `#flow`, `#cases`, `#faq` のIDが存在しますが、直接そこへジャンプできるリンクがサイト内にありません。
* **対応:** ユーザーがスクロールせずに到達できるよう、ページ内目次（サブナビゲーション）の設置を検討します。

### 06. CSS / JS バージョンパラメータの統一 `[優先度: 低]`
* **状況:** `index.html` のみキャッシュ対策の `?v=20260722m` が付与されていますが、他2ページには付与されていません。
* **対応:** 共通スタイル更新時に表示が崩れるのを防ぐため、全ページでパラメータ記述を統一します。

---

## 🚀 ローカル起動ガイド

本プロジェクトで使用している3Dロゴ（Three.js + SVGLoader）は、ブラウザのセキュリティ制限（CORS）のため、HTMLファイルを直接ダブルクリックで開くと正常に表示されません。

アニメーション等の動作確認時は、以下のいずれかの方法でローカルサーバーを起動し、`http://localhost...` 経由でアクセスしてください。

### 起動コマンド

プロジェクトのルートディレクトリ（`index.html` があるフォルダ）で実行してください。

#### 1. Python (推奨・インストール不要)
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000