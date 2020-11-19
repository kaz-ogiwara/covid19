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

  #### pcr_positive_daily.csv
  - 厚生労働省オープンデータ「陽性者数」
  - データは過去分を含めて上書きされるため、こちらにも記録としてアップロードする。
  - 詳しい注記などは厚生労働省のオープンデータページを参照：https://www.mhlw.go.jp/stf/covid-19/open-data.html

  #### pcr_tested_daily.csv
  - 厚生労働省オープンデータ「PCR検査実施人数」
  
  #### cases_total.csv
  - 厚生労働省オープンデータ「入院治療等を要する者の数」
  
  #### recovery_total.csv
  - 厚生労働省オープンデータ「退院又は療養解除となった者の数」
  
  #### death_total.csv
  - 厚生労働省オープンデータ「死亡者数」
  
  #### pcr_case_daily.csv
  - 厚生労働省オープンデータ「PCR検査の実施件数」

  #### serious.csv
  - 公表日ごとに全国の重症者数を掲載。
  - 厚生労働省のオープンデータには重症者数が載っていないので、summary.csvに代わってこのファイルを更新している。
  - データソース：「新型コロナウイルス感染症の現在の状況について」
  - 開示例：https://www.mhlw.go.jp/stf/newpage_10700.html

  #### effective_reproduction_number.csv
  - 日別に全国の実効再生産数を掲載。
  - 計算式は「（直近7日間の新規陽性者数／その前7日間の新規陽性者数）^（平均世代時間／報告間隔）」。
  - 平均世代時間は5日、報告間隔は7日と仮定。
  - リアルタイム性を重視して流行動態を把握するため、報告日ベースによる簡易的な計算式を用いている。
  - 精密な計算ではないこと、報告の遅れに影響を受けることに注意。
  - モデルと監修は北海道大学大学院医学研究院・西浦博教授。計算式の詳細は西浦教授の公開するGitHubリポジトリを参照。
  - https://github.com/contactmodel/COVID19-Japan-Reff

  #### demography.csv
  - データソース：「新型コロナウイルス感染症の国内発生動向」
  - 開示例：https://www.mhlw.go.jp/content/10906000/000696696.pdf
  - 年齢別の陽性者数、入院治療等を要する者の数、重症者数、死亡者数を掲載。
  - 年齢「不明」「非公表」「調査中」などはすべて「不明」としている。

  #### prefectures.csv
  - データソース：「国内事例における都道府県別の患者報告数」
  - 開示例：https://www.mhlw.go.jp/content/10906000/000619075.pdf
  - 都道府県ごとの検査陽性者数、死亡者数、PCR検査人数、実効再生産数などを掲載。
  - 項目一覧は以下のとおり。
    - testedPositive: 検査陽性者数
    - peopleTested: 検査実施人数
    - hospitalized: 入院治療等を要する者
    - serious: 重症者数
    - discharged: 退院・療養解除
    - deaths: 死亡者数
    - effectiveReproductionNumber: 実効再生産数

### データの更新
- 厚生労働省の発表にあわせて不定期で更新する予定です。

### ライセンス
- MITライセンスとします。研究、調査、報道など、商用・非商用を問わずご自由にお使いください。
- このプロジェクトによって生じたいかなる責任も開発者は負わないものとします。
- 著作権表示は以下のいずれかをお使いください。
  - 『東洋経済オンライン「新型コロナウイルス 国内感染の状況」制作：荻原和樹』
  - 『Toyo Keizai Online "Coronavirus Disease (COVID-19) Situation Report in Japan" by Kazuki OGIWARA』
