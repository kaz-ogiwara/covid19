# 新型コロナウイルス 国内感染の状況
新型コロナウイルス感染症（COVID-19）の国内における状況を厚生労働省の報道発表資料からビジュアルにまとめた。

[ENGLISH](https://github.com/kaz-ogiwara/covid19/blob/master/README.en.md)


### 公開ページ
- 東洋経済オンライン「新型コロナウイルス 国内感染の状況」
- https://toyokeizai.net/sp/visual/tko/covid19/

### データソース
- 厚生労働省の報道発表資料
- https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000121431_00086.html

### CSVデータ
- 使用したデータはCSVファイルでも公開しています。
- なお2020年7月より厚生労働省がオープンデータの提供を開始しました。
  - https://www.mhlw.go.jp/stf/covid-19/open-data.html

  #### summary.csv
  - ファイル：https://github.com/kaz-ogiwara/covid19/blob/master/data/summary.csv
  - データソース：「新型コロナウイルス感染症の現在の状況について」
  - 開示例：https://www.mhlw.go.jp/stf/newpage_10700.html
  - 公表日ごとに全国のPCR検査陽性者、退院者などの主要項目を掲載。
  - 厚生労働省のオープンデータ公表に伴い、7月15日以降は更新していない。

  #### prefectures.csv
  - ファイル：https://github.com/kaz-ogiwara/covid19/blob/master/data/prefectures.csv
  - データソース：「国内事例における都道府県別の患者報告数」
  - 開示例：https://www.mhlw.go.jp/content/10906000/000619075.pdf
  - 都道府県ごとの検査陽性者数、退院・療養解除、死亡者数、PCR検査人数を掲載。

  #### demography.csv
  - ファイル：https://github.com/kaz-ogiwara/covid19/blob/master/data/demography.csv
  - データソース：「新型コロナウイルス感染症の国内発生動向」
  - 開示例：https://www.mhlw.go.jp/content/10906000/000619074.pdf
  - 年齢別の死亡数、退院者数、重症者数、無症状者数を掲載。
  - 年齢「不明」「非公表」「調査中」はすべて「不明」としている。

  #### serious.csv
  - ファイル：https://github.com/kaz-ogiwara/covid19/blob/master/data/serious.csv
  - データソース：「新型コロナウイルス感染症の現在の状況について」
  - 開示例：https://www.mhlw.go.jp/stf/newpage_10700.html
  - 公表日ごとに全国の重症者数を掲載。
  - 厚生労働省のオープンデータには重症者数が載っていないので、summary.csvに代わってこのファイルを更新している。

### データの更新
- 厚生労働省の発表にあわせて不定期で更新する予定です。

### ライセンス
- MITライセンスとします。研究、調査、報道など、商用・非商用を問わずご自由にお使いください。
- 著作権表示は「東洋経済オンライン」または「TOYO KEIZAI ONLINE」としてください。
- ただし、このプロジェクトによって生じたいかなる責任も開発者は負わないものとします。
