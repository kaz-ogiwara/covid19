let gData;
let gRegions = [];

const LANG = $("html").attr("lang");
const REGION_THRESHOLD = 10;
const COLORS = {
  default: "#3DC",
  dark: "#399",
  patient: "#ED9",
  discharge: "#3CA",
  test: "#3DC",
  dead: "#E95",
  positive: "#ED9",
  selected: "#EC2",
};
const LABELS = {
  ja: {
    chart: {
      patients: {
        dead: "死亡数",
        discharge: "回復者数",
        positive: "陽性者数"
      },
      surveys: {
        patient: "有症数",
        positive: "陽性者数",
        test: "検査数"
      },
    },
  },
  en: {
    chart: {
      patients: {
        dead: "Deaths",
        discharge: "Recovered",
        positive: "Cases"
      },
      surveys: {
        patient: "Cases",
        positive: "Positive",
        test: "Tests"
      },
      demography: {
        f: "Female",
        m: "Male"
      }
    },
    age: {
      "10代": "10s",
      "20代": "20s",
      "30代": "30s",
      "40代": "40s",
      "50代": "50s",
      "60代": "60s",
      "70代": "70s",
      "80代": "80s",
      "90代": "90s",
      "10歳未満": "Under 10"
    }
  }
};


const init = () => {
  const drawPatientsChart = () => {
    let $wrapper = $("#patients-chart");
    $wrapper.empty();
    $wrapper.html("<canvas></canvas>");
    let $canvas = $wrapper.find("canvas")[0];

    let switchValue = $("#patients-block").find(".switch.selected").attr("value");
    let isStacked = (switchValue === "total") ? true: false;

    let config = {
      type: "bar",
      data: {
        labels: [],
        datasets: [{
          label: LABELS[LANG].chart.patients.discharge,
          backgroundColor: COLORS.discharge,
          borderColor: COLORS.discharge,
          data: []
        },{
          label: LABELS[LANG].chart.patients.dead,
          backgroundColor: COLORS.dead,
          borderColor: COLORS.dead,
          data: []
        },{
          label: LABELS[LANG].chart.patients.positive,
          backgroundColor: COLORS.positive,
          borderColor: COLORS.positive,
          data: []
        }]
      },
      options: {
        aspectRatio: 1.2,
        responsive: true,
        legend: {
          display: true,
          labels: {
            fontColor: "rgba(255, 255, 255, 0.7)"
          }
        },
        title: {
          display: false
        },
        tooltips: {
          xPadding: 24,
          yPadding: 12,
          displayColors: false,
          callbacks: {
            title: function(tooltipItem){
              let prefix = {
                ja: "",
                en: "As of "
              };

              let dateTime = tooltipItem[0].xLabel + " " + gData.transition[tooltipItem[0].index][2] + ":00";

              let suffix = {
                ja: {
                  total: "時点 累計",
                  new: "時点新規"
                },
                en: {
                  total: " Total",
                  new: " New cases"
                }
              };

              return prefix[LANG] + dateTime + suffix[LANG][switchValue];
            },
            label: function(tooltipItem, data){
              let row = gData.transition[tooltipItem.index];
              let ret;
              let suffix = {
                ja: "名",
                en: ""
              };

              if (switchValue === "new" && tooltipItem.index >= 1) {
                const prev = gData.transition[tooltipItem.index - 1];
                ret = [
                  LABELS[LANG].chart.patients.positive   + ": " + (row[4] - prev[4]) + suffix[LANG],
                  LABELS[LANG].chart.patients.discharge + ": " + (row[6] - prev[6]) + suffix[LANG],
                  LABELS[LANG].chart.patients.dead      + ": " + (row[7] - prev[7]) + suffix[LANG]
                ];
              } else {
                ret = [
                  LABELS[LANG].chart.patients.positive   + ": " + row[4] + suffix[LANG],
                  LABELS[LANG].chart.patients.discharge + ": " + row[6] + suffix[LANG],
                  LABELS[LANG].chart.patients.dead      + ": " + row[7] + suffix[LANG]
                ];
              }
              return ret;
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: isStacked,
            gridLines: {
              display: false
            },
            ticks: {
              fontColor: "rgba(255,255,255,0.7)"
            }
          }],
          yAxes: [{
            location: "bottom",
            stacked: false,
            gridLines: {
              display: true,
              zeroLineColor: "rgba(255,255,255,0.7)",
              color: "rgba(255, 255, 255, 0.3)"
            },
            ticks: {
              beginAtZero: true,
              fontColor: "rgba(255,255,255,0.7)",
              callback: function(value, index, values) {
                return value.toString();
              }
            }
          }]
        }
      }
    };

    if (switchValue === "new") {
      config.type = "line";
      config.data.datasets.forEach(function(dataset){
        dataset.fill = false;
        dataset.lineTension = 0.1;
        dataset.pointBackgroundColor = "#242a3c";
        dataset.pointBorderWidth = 1.5;
        dataset.pointRadius = 2.5;
        dataset.borderWidth = 4;
      });
    }

    if ($wrapper.width() >= 400) config.options.aspectRatio = 1.5;
    if ($wrapper.width() >= 600) config.options.aspectRatio = 1.8;

    gData.transition.forEach(function(date, i){
      config.data.labels.push(date[0] + "/" + date[1]);

      if (switchValue === "new" && i >= 1) {
        let prev = gData.transition[i - 1];
        config.data.datasets[2].data.push(date[4] - prev[4]);
        config.data.datasets[0].data.push(date[6] - prev[6]);
        config.data.datasets[1].data.push(date[7] - prev[7]);
      } else {
        config.data.datasets[2].data.push(date[4]);
        config.data.datasets[0].data.push(date[6]);
        config.data.datasets[1].data.push(date[7]);
      }
    });

    let ctx = $canvas.getContext('2d');
    window.myChart = new Chart(ctx, config);
  }

  const drawSurveysChart = () => {
    let $wrapper = $("#surveys-chart");
    $wrapper.empty();
    $wrapper.html("<canvas></canvas>");
    let $canvas = $wrapper.find("canvas")[0];

    let switchValue = $("#surveys-block").find(".switch.selected").attr("value");
    let isStacked = (switchValue === "total") ? true: false;

    let config = {
      type: "bar",
      data: {
        labels: [],
        datasets: [{
          label: LABELS[LANG].chart.surveys.positive,
          backgroundColor: [],
          borderColor: COLORS.positive,
          data: []
//        },{
//          label: LABELS[LANG].chart.surveys.positive,
//          backgroundColor: [],
//          borderColor: COLORS.positive,
//          data: []
        },{
          label: LABELS[LANG].chart.surveys.test,
          backgroundColor: [],
          borderColor: COLORS.test,
          data: []
        }]
      },
      options: {
        aspectRatio: 1.2,
        responsive: true,
        legend: {
          display: true,
          labels: {
            fontColor: "rgba(255, 255, 255, 0.7)"
          }
        },
        title: {
          display: false
        },
        tooltips: {
          xPadding: 24,
          yPadding: 12,
          displayColors: false,
          callbacks: {
            title: function(tooltipItem){
              let prefix = {
                ja: "",
                en: "As of "
              };

              let dateTime = tooltipItem[0].xLabel + " " + gData.transition[tooltipItem[0].index][2] + ":00";

              let suffix = {
                ja: {
                  total: "時点 累計",
                  new: "時点新規"
                },
                en: {
                  total: " Total",
                  new: " New cases"
                }
              };

              return prefix[LANG] + dateTime + suffix[LANG][switchValue];
            },
            label: function(tooltipItem, data){
              let row = gData.transition[tooltipItem.index];
              let ret;
              let suffix = {
                ja: "名",
                en: ""
              };

              if (switchValue === "new" && tooltipItem.index >= 1) {
                const prev = gData.transition[tooltipItem.index - 1];
                if (prev[3] !== "") {
                  ret = [
                    LABELS[LANG].chart.surveys.test     + ": " + (row[3] - prev[3]) + suffix[LANG],
                    LABELS[LANG].chart.surveys.positive + ": " + (row[4] - prev[4]) + suffix[LANG],
                    //LABELS[LANG].chart.surveys.patient  + ": " + (row[5] - prev[5]) + suffix[LANG]
                  ];
                }
              } else {
                ret = [
                  LABELS[LANG].chart.surveys.test     + ": " + row[3] + suffix[LANG],
                  LABELS[LANG].chart.surveys.positive + ": " + row[4] + suffix[LANG],
                  //LABELS[LANG].chart.surveys.patient  + ": " + row[5] + suffix[LANG]
                ];
              }
              return ret;
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: isStacked,
            gridLines: {
              display: false
            },
            ticks: {
              fontColor: "rgba(255,255,255,0.7)"
            }
          }],
          yAxes: [{
            location: "bottom",
            stacked: false,
            gridLines: {
              display: true,
              zeroLineColor: "rgba(255,255,255,0.7)",
              color: "rgba(255, 255, 255, 0.3)"
            },
            ticks: {
              suggestedMin: 0,
              fontColor: "rgba(255,255,255,0.7)",
              callback: function(value, index, values) {
                return value.toString();
              }
            }
          }]
        }
      }
    };

    if (switchValue === "new") {
      config.type = "line";
      config.data.datasets.forEach(function(dataset){
        dataset.fill = false;
        dataset.lineTension = 0.1;
        dataset.pointBackgroundColor = "#242a3c";
        dataset.pointBorderWidth = 1.5;
        dataset.pointRadius = 2.5;
        dataset.borderWidth = 4;
      });
    }

    if ($wrapper.width() >= 400) config.options.aspectRatio = 1.5;
    if ($wrapper.width() >= 600) config.options.aspectRatio = 1.8;

    gData.transition.forEach(function(date, i){
      config.data.labels.push(date[0] + "/" + date[1]);

      if (switchValue === "new" && i >= 1) {
        let prev = gData.transition[i - 1];
        //config.data.datasets[2].data.push(date[3] - prev[3]);
        config.data.datasets[1].data.push(date[3] - prev[3]);
        config.data.datasets[0].data.push(date[4] - prev[4]);
      } else {
        //config.data.datasets[2].data.push(date[3]);
        config.data.datasets[1].data.push(date[3]);
        config.data.datasets[0].data.push(date[4]);
      }

      let pcrTestColor = (date[0] >= 3 && date[1] >= 4) ? COLORS.dark: COLORS.test;

      //config.data.datasets[2].backgroundColor.push(pcrTestColor);
      config.data.datasets[1].backgroundColor.push(pcrTestColor);
      config.data.datasets[0].backgroundColor.push(COLORS.positive);
    });

    let ctx = $canvas.getContext('2d');
    window.myChart = new Chart(ctx, config);
  }

  const getPrefColor = (value) => {
    let ret = "rgba(90, 90, 90, 0.3)";
    if (value >= 1)  ret = COLORS.dark;
    if (value >= REGION_THRESHOLD) ret = COLORS.default;
    return ret;
  }

  const showUpdateDates = () => {
    ["last", "transition", "demography", "prefectures"].forEach(function(cls){
      $(".updated-" + cls).text(gData.updated[cls][LANG]);
    });
  }

  const loadData = () => {
    $.getJSON("https://raw.githubusercontent.com/yoshitar/covid19/master/data/data_id.json", function(data){
      gData = data;
      drawSurveysChart();
      drawPatientsChart();
      $("#container").addClass("show");
    })
  }

  const bindEvents = () => {
    $(".switch").on("click",function(){
      $(this).siblings(".switch").removeClass("selected");
      $(this).addClass("selected");
      if ($(this).closest("#patients-block")[0]) drawPatientsChart();
      if ($(this).closest("#surveys-block")[0]) drawSurveysChart();
    });

  }

  loadData();
  bindEvents();
};


$(function(){
  init();
});
