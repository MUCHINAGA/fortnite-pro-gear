# データ更新手順

このサイトの選手データは `data/players.json` で管理します。

## 0. ProSettings一覧から200件を再生成する

`prosettings-fortnite.html` を取得してから、変換スクリプトを実行します。

```powershell
$ProgressPreference='SilentlyContinue'
Invoke-WebRequest -Uri https://prosettings.net/lists/fortnite/ -UseBasicParsing -OutFile prosettings-fortnite.html
node scripts/import-prosettings.mjs
```

このスクリプトは世界大会経験者として把握している選手を優先し、その後にProSettings掲載順のプロ選手を並べ、合計200件を `data/players.json` に書き出します。

## 1. 選手を追加する

`players` 配列に以下の形で1人分を追加します。

```json
{
  "name": "PlayerName",
  "team": "Team Name",
  "country": "Country",
  "status": "世界大会出場経験",
  "input": "mnk",
  "note": "この選手の構成を見るときの短いコメント。",
  "gear": {
    "mouse": "Mouse Name",
    "sensitivity": "800 DPI / X 6.0% / Y 6.0%",
    "monitor": "Monitor Name",
    "keyboard": "Keyboard Name",
    "mousepad": "Mousepad Name",
    "headset": "Headset Name"
  },
  "checkedAt": "2026-05-23",
  "source": "Source Name",
  "sourceUrl": "https://example.com/player"
}
```

## 2. 更新日を変える

ファイル先頭の `updatedAt` を更新します。

```json
"updatedAt": "2026-05-23"
```

## 3. 未確認項目の扱い

推測で埋めず、空文字にします。サイト側では「未確認」と表示されます。

```json
"monitor": ""
```

## 4. Amazonアフィリエイト向けの注意

- 価格や在庫を手入力しない。
- Amazonの画像を勝手に保存して使わない。
- 承認後はアソシエイト・セントラルで作った正式リンクを使う。
- 商品リンクの近く、またはサイト上部に広告表記を置く。
- 運営者情報、問い合わせ先、プライバシーポリシーを公開前に実情報へ差し替える。
