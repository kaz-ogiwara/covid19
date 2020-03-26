let gData;
let gRegions = [];

const LANG = $("html").attr("lang");
const REGION_THRESHOLD = 10;
const COLORS = {
  default: "#3DC",
  carriers: "#3DC",
  cases: "#6DF",
  deaths: "#EB8",
  discharged: "#9FC",
  serious: "#FEA",
  pcrtested: "#4CD",
  dark: "#399",
  selected: "#EC2",
  gender: {
    f: "#FE9",
    m: "#2B9"
  }
};
const LABELS = {
  ja: {
    change: "前日比",
    unit: {
      carriers: "名",
      cases: "名",
      discharged: "名",
      pcrtested: "名",
      serious: "名",
      deaths: "名"
    },
    demography: {
      deaths: "死亡",
      serious: "重症",
      discharged: "退院",
      misc: "その他",
      nosym: "無症状"
    },
    age: [
      "10歳未満",
      "10代",
      "20代",
      "30代",
      "40代",
      "50代",
      "60代",
      "70代",
      "80代",
      "90代",
      "非公表"
    ]
  },
  en: {
    change: "DoD: ",
    unit: {
      carriers: "",
      cases: "",
      discharged: "",
      pcrtested: "",
      serious: "",
      deaths: ""
    },
    demography: {
      deaths: "Deaths",
      serious: "Serious",
      discharged: "Discharged",
      misc: "Misc",
      nosym: "No Symptom"
    },
    age: [
      "Under 10",
      "10s",
      "20s",
      "30s",
      "40s",
      "50s",
      "60s",
      "70s",
      "80s",
      "90s",
      "Unknown"
    ]
  }
};


const init = () => {
  const addCommas = (num) => {
    return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  }

  const drawTransitionBlocks = () => {
    $(".transition-block").each(function(){
      let code = $(this).attr("code");
      drawTransitionChart($(this), code);
    });
  }

  const drawTransitionChart = ($block, code) => {
    let $chart = $block.find(".chart").empty().html("<canvas></canvas>");
    let $canvas = $chart.find("canvas")[0];
    let switchValue = $block.find(".switch.selected").attr("value");

    let rows = gData.transition[code];

    let latestValue = rows[rows.length - 1][3];
    let latestChange = latestValue - rows[rows.length - 2][3];
        latestChange = addCommas(latestChange).toString();
        if (latestChange.charAt(0) !== "-") latestChange = "+" + latestChange;
    let $latest = $block.find(".latest");
    $latest.find(".value").text(addCommas(latestValue));
    $latest.find(".unit").text(LABELS[LANG].unit[code]);
    $latest.find(".type").text($block.find(".switch[value=total]").text());
    $latest.find(".change").text(LABELS[LANG].change + " " + latestChange);

    let config = {
      type: "bar",
      data: {
        labels: [],
        datasets: [{
          label: $block.find("h3:first").text(),
          backgroundColor: COLORS[code],
          data: []
        }]
      },
      options: {
        aspectRatio: 1.8,
        responsive: true,
        legend: {
          display: false
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
              let dateTime = tooltipItem[0].xLabel + " " + "12:00";
              if (LANG === "ja") dateTime = dateTime + "時点";
              if (LANG === "en") dateTime = "As of " + dateTime;
              let suffix = $block.find(".switch.selected").text();
              return dateTime + " " + suffix;
            },
            label: function(tooltipItem, data){
              let ret = data.datasets[0].label + ": " + addCommas(data.datasets[0].data[tooltipItem.index]) + " " + LABELS[LANG].unit[code];
              return ret;
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: false,
            gridLines: {
              display: false
            },
            ticks: {
              fontColor: "rgba(255,255,255,0.7)",
              maxRotation: 0,
              minRotation: 0,
              callback: (label) => {
                return " " + label + " ";
              }
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
                if (Math.floor(value) === value) {
                  return addCommas(value.toString());
                }
              }
            }
          }]
        }
      }
    };

    if ($block.width() >= 400) {
      config.options.aspectRatio = 2.4;
    }

    rows.forEach(function(row, i){
      if (switchValue === "total") {
        config.data.labels.push(row[1] + "/" + row[2]);
        config.data.datasets[0].data.push(row[3]);
      } else if (i >= 1) {
        config.data.labels.push(row[1] + "/" + row[2]);
        let prev = rows[i - 1];
        config.data.datasets[0].data.push(row[3] - prev[3]);
      }
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

  const drawJapanMap = () => {
    const WIDTH = $("#japan-map").width();

    let prefs = [];
    gData.prefectures.forEach(function(pref, i){
      prefs.push({
        code: pref.code,
        jp: pref.jp,
        en: pref.en,
        color: getPrefColor(pref.value),
        hoverColor: COLORS.selected,
        prefectures: [pref.code]
      });
    });

    $("#japan-map").japanMap({
      areas: prefs,
      width: WIDTH,
      borderLineColor: "#fcfcfc",
      borderLineWidth : 0.25,
      lineColor : "#ccc",
      lineWidth: 1,
      drawsBoxLine: false,
      showsPrefectureName: false,
      movesIslands : true,
      fontSize : 11,
      onHover : function(data){
        console.log("a");
        drawRegionChart(data.code, 0);
      }
    });
  }

  const drawDemographyChart = () => {
    $wrapper = $("#demography-chart").empty().html('<canvas></canvas>');
    $canvas = $wrapper.find("canvas")[0];

    let config = {
      type: "horizontalBar",
      data: {
        labels: [],
        datasets: [{
          label: LABELS[LANG].demography.deaths,
          backgroundColor: COLORS.deaths,
          borderWidth: 0.5,
          borderColor: "#242a3c",
          data: []
        },{
          label: LABELS[LANG].demography.serious,
          backgroundColor: COLORS.serious,
          borderWidth: 0.5,
          borderColor: "#242a3c",
          data: []
        },{
          label: LABELS[LANG].demography.misc,
          backgroundColor: COLORS.dark,
          borderWidth: 0.5,
          borderColor: "#242a3c",
          data: []
        },{
          label: LABELS[LANG].demography.nosym,
          backgroundColor: COLORS.cases,
          borderWidth: 0.5,
          borderColor: "#242a3c",
          data: []
        }]
      },
      options: {
        aspectRatio: 0.9,
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
          displayColors: true,
          callbacks: {
            title: function(tooltipItem){
              let suffix = {
                ja: "名",
                en: "cases"
              };
              let age = tooltipItem[0].yLabel;
              let total = 0;
              tooltipItem.forEach(function(item, i){
                total += item.xLabel;
              });

              return age + ": " + total + " " + suffix[LANG];
            },
            label: function(tooltipItem, data){
              let suffix = {
                ja: "名",
                en: " cases"
              };
              return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.value + suffix[LANG];
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            position: "top",
            gridLines: {
              color: "rgba(255,255,255,0.2)"
            },
            ticks: {
              suggestedMin: 0,
              fontColor: "rgba(255,255,255,0.7)",
              callback: function(value, index, values) {
                return value.toString();
              }
            }
          }],
          yAxes: [{
            stacked: true,
            barPercentage: 0.8,
            gridLines: {
              color: "rgba(255,255,255,0.1)"
            },
            ticks: {
              fontColor: "rgba(255,255,255,0.7)"
            }
          }]
        }
      }
    };

    if ($wrapper.outerWidth() >= 400) config.options.aspectRatio = 1.1;
    if ($wrapper.outerWidth() >= 600) config.options.aspectRatio = 1.3;

    gData.demography.forEach(function(age, index){
      config.data.labels.push(LABELS[LANG].age[index]);
      for (let i = 0; i < 4; i++) {
        config.data.datasets[i].data.push(age[i]);
      }
    });

    let ctx = $canvas.getContext('2d');
    window.myChart = new Chart(ctx, config);
  }

  const drawRegionChart = (targetRegion) => {
    let $wrapper = $("#region-chart");
    $wrapper.empty();
    $wrapper.html('<canvas></canvas>');
    let $canvas = $wrapper.find("canvas")[0];

    let config = {
      type: "horizontalBar",
      data: {
        labels: [],
        datasets: [{
          label: "",
          backgroundColor: [],
          data: []
        }]
      },
      options: {
        aspectRatio: 0.4,
        animation: {
          duration: 1000
        },
        responsive: true,
        legend: {
          display: false
        },
        title: {
          display: false
        },
        tooltips: {
          xPadding: 24,
          yPadding: 12,
          displayColors: true,
          callbacks: {
            title: function(tooltipItem){
              return tooltipItem[0].yLabel;
            },
            label: function(tooltipItem, data){
              let suffix = {
                ja: " 名",
                en: " cases"
              };
              return tooltipItem.xLabel + suffix[LANG];
            }
          }
        },
        scales: {
          xAxes: [{
            position: "top",
            gridLines: {
              color: "rgba(255,255,255,0.2)"
            },
            ticks: {
              suggestedMin: 0,
              fontColor: "rgba(255,255,255,0.7)",
              callback: function(value, index, values) {
                return value.toString();
              }
            }
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(255,255,255,0.1)"
            },
            ticks: {
              fontColor: "rgba(255,255,255,0.7)",
            }
          }]
        }
      }
    };

    if ($wrapper.outerWidth() >= 400) config.options.aspectRatio = 0.4;
    if (targetRegion !== "") config.options.animation.duration = 0;

    gData.prefectures.forEach(function(pref, i){
      if (pref.value >= 1) {
        config.data.labels.push(pref[LANG]);
        config.data.datasets[0].data.push(pref.value);

        if (targetRegion === pref.code) {
          config.data.datasets[0].backgroundColor.push(COLORS.selected);
        } else {
          config.data.datasets[0].backgroundColor.push(getPrefColor(pref.value));
        }
      }
    });

    let ctx = $canvas.getContext('2d');
    window.myChart = new Chart(ctx, config);
  }

  const showUpdateDates = () => {
    ["last", "transition", "demography", "prefectures"].forEach(function(cls){
      $(".updated-" + cls).text(gData.updated[cls][LANG]);
    });
  }

  const loadData = () => {
    $.getJSON("data/data.json", function(data){
    //$.getJSON("https://raw.githubusercontent.com/kaz-ogiwara/covid19/master/data/data.json", function(data){
      gData = data;
      drawTransitionBlocks();
      drawDemographyChart();
      drawJapanMap();
      drawRegionChart("");
      showUpdateDates();
      $("#container").addClass("show");
    })
  }

  const bindEvents = () => {
    $(".switch").on("click",function(){
      $(this).siblings(".switch").removeClass("selected");
      $(this).addClass("selected");
      drawTransitionChart($(this).closest(".transition-block"), $(this).closest(".transition-block").attr("code"));
    });

    $(".more").on("click",function(){
      $(this).closest("p.notes").addClass("show");
    });
  }

  loadData();
  bindEvents();
};


$(function(){
  init();
});
