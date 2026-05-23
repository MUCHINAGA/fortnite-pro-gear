# GitHub Pages公開手順

このサイトは静的HTML/CSS/JSなので、GitHub Pagesでそのまま公開できます。

## 1. GitHubでリポジトリを作る

GitHubで新しいリポジトリを作ります。例:

```text
fortnite-pro-gear
```

Publicリポジトリにすると、無料プランでもGitHub Pagesを使いやすいです。

## 2. このフォルダをGitに登録する

```powershell
git init
git add index.html styles.css app.js data docs scripts .nojekyll .gitignore README.md
git commit -m "Create Fortnite pro gear site"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/fortnite-pro-gear.git
git push -u origin main
```

`YOUR_NAME` は自分のGitHubユーザー名に置き換えてください。

## 3. GitHub Pagesを有効化する

リポジトリの `Settings` → `Pages` を開きます。

```text
Source: Deploy from a branch
Branch: main
Folder: / root
```

保存すると、数分後に以下のようなURLで公開されます。

```text
https://YOUR_NAME.github.io/fortnite-pro-gear/
```

## 4. HTTPSについて

GitHub Pagesは標準でHTTPSに対応しています。独自ドメインを使わない場合でも、上記の `github.io` URLはHTTPSで公開されます。

独自ドメインを使う場合は、Pages設定でCustom domainを追加し、DNS設定後に `Enforce HTTPS` を有効化します。

## Gitが使えない場合

このPCで `git` コマンドが使えない場合は、GitHubのリポジトリ画面から `Add file` → `Upload files` を選び、以下をアップロードします。

```text
index.html
styles.css
app.js
README.md
.nojekyll
.gitignore
data/
docs/
scripts/
```
