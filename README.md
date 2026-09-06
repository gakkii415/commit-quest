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

`dist-pages/index.html` と `dist-pages/assets/` をリポジトリ直下へ反映してコミットします。GitHub Pagesは `main` のルートを配信します。Reactのソースは `app/page.tsx`、スタイルは `app/globals.css`、静的版の入口は `pages/` です。未接続では公開API、接続後はGitHub公式GraphQL APIの viewer を直接取得します。

既存のSites向けビルドは `npm run build`。公開リポジトリの `.openai/hosting.json` は個別のSite IDを含みません。

## 非公開の貢献（v5）

「非公開の貢献も表示する」から、classic PATの read:user 権限のみで接続します。repo権限は不要です。トークンはメモリにのみ保持し、GitHubの固定APIエンドポイントにだけ送ります。ストレージ、URL、ログ、リポジトリに保存しません。再読込で接続が解除されます。解除時は認証データを消して公開データへ戻します。

認証後はAPIが返す日付範囲とcontributionLevelをそのまま使い、端末の日付で切り取りません。認証失敗で公開データに自動フォールバックしません。公式仕様: https://docs.github.com/en/graphql/reference/users

認証取得処理は模擬応答で検証。実際の個人トークンは開発環境にないため、本人データとウィジェットの一致は接続後の確認が必要です。
