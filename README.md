# BeEngineer LP - ローカル起動ガイド

本プロジェクトで使用している3Dロゴ（Three.js + SVGLoader）は、ブラウザのセキュリティ制限（CORS）のため、HTMLファイルを直接ダブルクリックで開くと正常に表示されません。

本来のアニメーションを確認するには、以下のいずれかの方法でローカルサーバーを起動し、`http://localhost...` 経由でアクセスしてください。

---

## 🚀 ローカルサーバー起動コマンド

プロジェクトのルートディレクトリ（`index.html` があるフォルダ）で実行してください。

### 1. Python (推奨・インストール不要)
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000