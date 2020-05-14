# Coronavirus Disease (COVID-19) Situation Report in Japan
The state of the infection of the new coronavirus (COVID19) in Japan was summarized visually from a press release from the Ministry of Health, Labor and Welfare.

[JAPANESE](https://github.com/kaz-ogiwara/covid19/blob/master/README.md)

### Public page
- Toyo Keizai Online "Coronavirus Disease (COVID-19) Situation Report in Japan"
- https://toyokeizai.net/sp/visual/tko/covid19/en.html

### Data source
- Materials released by the Ministry of Health, Labor and Welfare
- https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000121431_00086.html

### CSV data
- The data used is also available as a CSV file.

  #### summary.csv
  - File: https://github.com/kaz-ogiwara/covid19/blob/master/data/summary.csv
  - Data source example [Japanese]: https://www.mhlw.go.jp/stf/newpage_10700.html
  - Nationwide main items such as number of people PCR tested or positive cases.
  - The public page visualizes only on and after 17 February since MHLW started publishing data everyday after that.
  
  #### prefectures.csv
  - File: https://github.com/kaz-ogiwara/covid19/blob/master/data/prefectures.csv
  - Data source example [Japanese]: https://www.mhlw.go.jp/content/10906000/000619075.pdf
  - Number of tested positive, discharged, deaths, and people PCR tested, by publication date and prefecture.

  #### demography.csv
  - File: https://github.com/kaz-ogiwara/covid19/blob/master/data/demography.csv
  - Data source example [Japanese]: https://www.mhlw.go.jp/content/10906000/000619074.pdf
  - Number of deaths, discharged cases, serious cases, and cases with no symptom, by age.
  - "Unknown", "Undisclosed", and "Checking" are all summarized as "Unknown".
  - The last updated date is 7 May since MHLW does not publish the data after that.

### Update data
- It will be updated on an irregular basis according to the announcement by the Ministry of Health, Labor and Welfare.

### License
- MIT license. Feel free to use it for research, news, and other commercial and non-commercial purposes.
- Copyright notice should be like: "東洋経済オンライン" or "TOYO KEIZAI ONLINE".
- The developer assumes no responsibility arising from this project.
