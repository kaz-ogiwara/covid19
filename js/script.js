let gData;
let gRegions = [];

const LANG = $("html").attr("lang");
const REGION_THRESHOLD = 10;
const COLORS = {
  default: "#3DC",
  carriers: "#3DC",
  cases: "#6DF",
  dead: "#EB8",
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
      dead: "名"
    },
    demography: {
      f: "女性",
      m: "男性"
    },
    age: {
      "10代": "10代",
      "20代": "20代",
      "30代": "30代",
      "40代": "40代",
      "50代": "50代",
      "60代": "60代",
      "70代": "70代",
      "80代": "80代",
      "90代": "90代",
      "10歳未満": "10歳未満"
    }
  },
  en: {
    change: "DoD: ",
    unit: {
      carriers: "",
      cases: "",
      discharged: "",
      pcrtested: "",
      serious: "",
      dead: ""
    },
    demography: {
      f: "Female",
      m: "Male"
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
        if (parseInt(latestChange) > 0) latestChange = "+" + latestChange.toString();
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
          label: LABELS[LANG].demography.f,
          backgroundColor: COLORS.gender.f,
          data: []
        },{
          label: LABELS[LANG].demography.m,
          backgroundColor: COLORS.gender.m,
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
              return tooltipItem[0].yLabel;
            },
            label: function(tooltipItem, data){
              let suffix = {
                ja: "名",
                en: ""
              };
              return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.value + suffix[LANG];
            }
          }
        },
        scales: {
          xAxes: [{
            position: "top",
            color: "yellow",
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
              callback: function (value){
                return LABELS[LANG].age[value];
              }
            }
          }]
        }
      }
    };

    if ($wrapper.outerWidth() >= 400) config.options.aspectRatio = 1.1;
    if ($wrapper.outerWidth() >= 600) config.options.aspectRatio = 1.3;

    let dsi = 0;
    for (let gender in gData.demography) {
      for (let age in gData.demography[gender]) {
        let value = gData.demography[gender][age];
        if (dsi === 0) config.data.labels.push(age);
        config.data.datasets[dsi].data.push(value);
      }
      dsi++;
    }

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

    if ($wrapper.outerWidth() >= 400) config.options.aspectRatio = 0.6;
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
    $.getJSON("https://raw.githubusercontent.com/kaz-ogiwara/covid19/master/data/data.json", function(data){
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
