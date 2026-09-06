# GitHub Contributions

GitHubの芝生を再現した、スマートフォン向けの貢献カレンダーです。

公開URL: https://gakkii415.github.io/commit-quest/

- 直近365日を、日曜始まり・7行の週単位で表示
- マスをタップすると日付と貢献数を表示
- スマートフォンではマスを大きくし、横スワイプで過去を表示
- 最初は最新の日付付近を表示
- 端末のライト／ダーク表示に追従

データ: [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api)。GitHubプロフィールで公開表示される貢献数と濃淡レベルを使用します。更新に最大約1時間かかる場合があります。日付はGitHubのデータのまま、表示期間の終点は端末の日付で決めます。

## 開発・公開

Node.js 22.13以降。

```sh
npm ci
npm run build:pages
```

`dist-pages/index.html` と `dist-pages/assets/` をリポジトリ直下へ反映してコミットします。GitHub Pagesは `main` のルートを配信します。Reactのソースは `app/page.tsx`、スタイルは `app/globals.css`、静的版の入口は `pages/` です。Pages版はブラウザから公開APIを直接呼び、認証トークンは使いません。

既存のSites向けビルドは `npm run build`。公開リポジトリの `.openai/hosting.json` は個別のSite IDを含みません。
