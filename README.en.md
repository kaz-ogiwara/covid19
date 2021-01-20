# Coronavirus Disease (COVID-19) Situation Report in Japan
The state of the infection of the new coronavirus (COVID-19) in Japan was summarized visually from a press release from the Ministry of Health, Labor and Welfare (MHLW).

[JAPANESE](https://github.com/kaz-ogiwara/covid19/blob/master/README.md)

## Important Notice (January 21)
- Due to a change in the person in charge of the site, this repository will no longer be updated after January 31.
- If you have any inquiries or requests, please fill out [our inquiry form](https://s.toyokeizai.net/apply.html?id=CONTACTUS) \[Japanese\].

### Public page
- Toyo Keizai Online "Coronavirus Disease (COVID-19) Situation Report in Japan"
- https://toyokeizai.net/sp/visual/tko/covid19/en.html

### Data source
- Press releases by the MHLW
- https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000121431_00086.html
- The part of prefectural data, such as the number of Tested Positive in Tokyo, is retrieved from reports by each prefecture.

### CSV data
- The data used is also available as a CSV file.

   #### pcr_positive_daily.csv
   - The copy of the same file from MHLW open data.
   - Since the open data is saved as an overwrite, to keep the past data.
   - For more details, refer to: https://www.mhlw.go.jp/stf/covid-19/open-data.html

   #### pcr_tested_daily.csv
   - The copy of the same file from MHLW open data.

   #### cases_total.csv
   - The copy of the same file from MHLW open data.

   #### recovery_total.csv
   - The copy of the same file from MHLW open data.

   #### death_total.csv
   - The copy of the same file from MHLW open data.

   #### pcr_case_daily.csv
   - The copy of the same file from MHLW open data.

   #### serious.csv
   - This file contains the daily number of serious (critically ill) cases.
   - Since MHLW open data does not have the file of serious cases, we update this file from MHLW press releases.
   
   #### effective_reproduction_number.csv
   - This file contains the daily Effective Reproduction Number.
   - Formula: (New cases in past 7 days / New cases in 7 days before that) ^ (mean generation time / length of reporting interval).
   - Mean generation time is supposed to be 5 days, and length of reporting interval is supposed to be 7 days.
   - For the purpose of understanding current trends in real time, this formula is simplified and based on reporting dates.
   - Note that this formula is a simplified version and may be affected by reporting delays.
   - Model and supervised by Professor Hiroshi Nishiura of Hokkaido University Graduate School of Medicine.
   - Refer to GitHub repository published by Prof. Nishiura for further details.
   - https://github.com/contactmodel/COVID19-Japan-Reff

  #### demography.csv
  - Data source example [Japanese]: https://www.mhlw.go.jp/content/10906000/000696696.pdf
  - Number of tested positive, hospitalized, critically ill, and deaths, by age group.
  - "Unknown", "Undisclosed", and "Checking" are all summarized as "Unknown".

  #### prefectures.csv
  - File: https://github.com/kaz-ogiwara/covid19/blob/master/data/prefectures.csv
  - Data source example [Japanese]: https://www.mhlw.go.jp/content/10906000/000619075.pdf
  - Items such as the number of tested positive or people PCR tested, by publication date and prefecture.
  - Here are the items:
     - testedPositive: Tested Positive
     - peopleTested: People Tested
     - hospitalized: Hospitalized
     - serious: Critically Ill
     - discharged: Discharged
     - deaths: Deaths
     - effectiveReproductionNumber: Effective Reproduction Number
  
### Update data
- It will be updated on an irregular basis according to the announcement by the Ministry of Health, Labor and Welfare.

### License
- MIT license. Feel free to use it for research, news, and other commercial and non-commercial purposes.
- The developer assumes no responsibility arising from this project.
- Copyright notice should be like:
  - 東洋経済オンライン「新型コロナウイルス 国内感染の状況」制作：荻原和樹
  - Toyo Keizai Online "Coronavirus Disease (COVID-19) Situation Report in Japan" by Kazuki OGIWARA
