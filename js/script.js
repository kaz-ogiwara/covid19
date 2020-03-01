let gData;
let gRegions = [];

const LAST_DATE = "2020-02-29T00:00:00+09:00";
const AGE_LABELS = ["80代","70代","60代","50代","40代","30代","20代","10代","10歳未満"];
const REGION_THRESHOLD = 10;
const COLORS = {
  default: "#33ddcc",
  dark: "#399",
  selected: "#ec2",
  gender: {
    f: "#FE9",
    m: "#2B9"
  }
};


const init = () => {
  const drawTransitionChart = () => {
    const dates = () => {
      let ret = [];
      let start = new Date("2020-01-15T00:00:00+09:00");
      let end   = new Date(LAST_DATE);

      for(let t = start; t <= end; t.setDate(t.getDate() + 1)) {
        let m = t.getMonth() + 1;
        let d = t.getDate();
        let s = m.toString() + "/" + d.toString();
        ret.push(s);
      }

      return ret;
    }

    let $wrapper = $("#transition-chart");
    $wrapper.empty();
    $wrapper.html("<canvas></canvas>");
    let $canvas = $wrapper.find("canvas")[0];

    let config = {
      type: "bar",
      data: {
        labels: dates(),
        datasets: [{
          label: "患者数",
          backgroundColor: COLORS.default,
          data: []
        }]
      },
      options: {
        aspectRatio: 1.2,
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
              return tooltipItem[0].xLabel;
            },
            label: function(tooltipItem, data){
              return tooltipItem.yLabel + "名";
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              display: false
            },
            ticks: {
              fontColor: "rgba(255,255,255,0.7)"
            }
          }],
          yAxes: [{
            location: "bottom",
            stacked: true,
            gridLines: {
              display: true,
              color: "rgba(255, 255, 255, 0.3)"
            },
            ticks: {
              suggestedMin: 0,
              fontColor: "rgba(255,255,255,0.7)",
              callback: function(value, index, values) {
                return value.toString() + " 名";
              }
            }
          }]
        }
      }
    };

    if ($wrapper.width() >= 400) config.options.aspectRatio = 1.5;
    if ($wrapper.width() >= 600) config.options.aspectRatio = 1.8;

    let sdata = [];

    dates().forEach(function(d, j){
      sdata.push(0);
    });

    gData.forEach(function(patient, i){
      dates().forEach(function(d, j){
        if (patient[3] === d) {
          if ($("#transition-block").find(".switch.selected").attr("value") === "total") {
            for (let k = j; k < sdata.length; k++) {
              sdata[k]++;
            }
          } else {
            sdata[j]++;
          }
        }
      });
    });

    config.data.datasets[0].data = sdata;

    let ctx = $canvas.getContext('2d');
    window.myChart = new Chart(ctx, config);
  }

  const drawRegionChart = (targetRegion, isAnimated) => {
    const convertRegionName = (name) => {
      if (name === "東京") {name = "東京都";}
      if (name === "京都") {name = "京都府";}
      if (name === "大阪") {name = "大阪府";}
      if ( name !== "東京都"
        && name !== "大阪府"
        && name !== "京都府"
        && name !== "北海道"
        && name !== "調査中"
        && name.slice(-1) !== "県") {
          name = name + "県";
      }
      if (name.indexOf("中国") !== -1) {name = "中国居住者";}
      return name;
    }

    let $wrapper = $("#region-chart");
    $wrapper.empty();
    $wrapper.html('<canvas></canvas>');
    let $canvas = $wrapper.find("canvas")[0];

    gRegions = [];
    gData.forEach(function(patient, i){
      let hit = -1;
      gRegions.forEach(function(region, j){
        if (region.label == convertRegionName(patient[6])) hit = j;
      });

      if (hit >= 0) {
        gRegions[hit].value++;
      } else {
        gRegions.push({label:convertRegionName(patient[6]),value:1});
      }
    });

    gRegions.sort(function(a, b) {
      if (a.value <= b.value)   return 1;
      return -1;
    });

    let cLabels = [];
    let cValues = [];
    let cColors = [];

    gRegions.forEach(function(region, i){
      cLabels.push(region.label);
      cValues.push(region.value);

      if (region.label === "中国居住者" || region.label === "調査中") {
        cColors.push("rgba(255,255,255,0.4)");
      } else if (region.label === targetRegion) {
        cColors.push(COLORS.selected);
      } else {
        cColors.push(getPrefColor(region.label));
      }
    });

    let config = {
      type: "horizontalBar",
      data: {
        labels: cLabels,
        datasets: [{
          label: "",
          backgroundColor: cColors,
          data: cValues
        }]
      },
      options: {
        aspectRatio: 0.8,
        animation: {
          duration: isAnimated
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
              return tooltipItem.xLabel + "名";
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
                return value.toString() + " 名";
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

    if ($wrapper.outerWidth() >= 400) config.options.aspectRatio = 1.0;
    if ($wrapper.outerWidth() >= 600) config.options.aspectRatio = 1.2;

    let ctx = $canvas.getContext('2d');
    window.myChart = new Chart(ctx, config);
  }

  const getPrefColor = (name) => {
    let ret = "#666";
    gRegions.forEach(function(region, i){
      if (region.label === name) {
        ret = COLORS.default;
      }
    });

    return ret;
  }

  const drawJapanMap = () => {
    const WIDTH = $("#japan-map").width();
    const PREFECTURES = [
      {code:1,jp:"北海道",en:"Hokkaido"},
      {code:2,jp:"青森県",en:"Aomori"},
      {code:3,jp:"岩手県",en:"Iwate"},
      {code:4,jp:"宮城県",en:"Miyagi"},
      {code:5,jp:"秋田県",en:"Akita"},
      {code:6,jp:"山形県",en:"Yamagata"},
      {code:7,jp:"福島県",en:"Fukushima"},
      {code:8,jp:"茨城県",en:"Ibaraki"},
      {code:9,jp:"栃木県",en:"Tochigi"},
      {code:10,jp:"群馬県",en:"Gunma"},
      {code:11,jp:"埼玉県",en:"Saitama"},
      {code:12,jp:"千葉県",en:"Chiba"},
      {code:13,jp:"東京都",en:"Tokyo"},
      {code:14,jp:"神奈川県",en:"Kanagawa"},
      {code:15,jp:"新潟県",en:"Niigata"},
      {code:16,jp:"富山県",en:"Toyama"},
      {code:17,jp:"石川県",en:"Ishikawa"},
      {code:18,jp:"福井県",en:"Fukui"},
      {code:19,jp:"山梨県",en:"Yamanashi"},
      {code:20,jp:"長野県",en:"Nagano"},
      {code:21,jp:"岐阜県",en:"Gifu"},
      {code:22,jp:"静岡県",en:"Shizuoka"},
      {code:23,jp:"愛知県",en:"Aichi"},
      {code:24,jp:"三重県",en:"Mie"},
      {code:25,jp:"滋賀県",en:"Shiga"},
      {code:26,jp:"京都府",en:"Kyoto"},
      {code:27,jp:"大阪府",en:"Osaka"},
      {code:28,jp:"兵庫県",en:"Hyogo"},
      {code:29,jp:"奈良県",en:"Nara"},
      {code:30,jp:"和歌山県",en:"Wakayama"},
      {code:31,jp:"鳥取県",en:"Tottori"},
      {code:32,jp:"島根県",en:"Shimane"},
      {code:33,jp:"岡山県",en:"Okayama"},
      {code:34,jp:"広島県",en:"Hiroshima"},
      {code:35,jp:"山口県",en:"Yamaguchi"},
      {code:36,jp:"徳島県",en:"Tokushima"},
      {code:37,jp:"香川県",en:"Kagawa"},
      {code:38,jp:"愛媛県",en:"Ehime"},
      {code:39,jp:"高知県",en:"Kochi"},
      {code:40,jp:"福岡県",en:"Fukuoka"},
      {code:41,jp:"佐賀県",en:"Saga"},
      {code:42,jp:"長崎県",en:"Nagasaki"},
      {code:43,jp:"熊本県",en:"Kumamoto"},
      {code:44,jp:"大分県",en:"Oita"},
      {code:45,jp:"宮崎県",en:"Miyazaki"},
      {code:46,jp:"鹿児島県",en:"Kagoshima"},
      {code:47,jp:"沖縄県",en:"Okinawa"}
    ];

    let prefs = [];
    PREFECTURES.forEach(function(pref, i){
      prefs.push({
        code: pref.code,
        jp: pref.jp,
        en: pref.en,
        color: getPrefColor(pref.jp),
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
      onSelect : function(data){
        drawRegionChart(data.name, 0);
      }
    });
  }

  const drawDemographicChart = () => {
    $wrapper = $("#age-chart");
    $wrapper.empty();
    $wrapper.html('<canvas></canvas>');
    $canvas = $wrapper.find("canvas")[0];

    let dataValues = {
      f: [0,0,0,0,0,0,0,0,0,0],
      m: [0,0,0,0,0,0,0,0,0,0]
    };

    gData.forEach(function(patient, i){
      let gender;
      let ageidx = -1;

      if (patient[5] == "男") gender = "m";
      if (patient[5] == "女") gender = "f";

      AGE_LABELS.forEach(function(a, i){
        if (patient[4] === a) {
          ageidx = i;
        }
      });

      if (gender && ageidx >= 0) {
        dataValues[gender][ageidx]++;
      }
    });

    let config = {
      type: "horizontalBar",
      data: {
        labels: AGE_LABELS,
        datasets: [{
          label: "女性",
          backgroundColor: COLORS.gender.f,
          data: dataValues.f
        },{
          label: "男性",
          backgroundColor: COLORS.gender.m,
          data: dataValues.m
        }]
      },
      options: {
        aspectRatio: 1.0,
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
              return data.datasets[tooltipItem.datasetIndex].label + "：" + tooltipItem.value + "名";
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
                return value.toString() + " 名";
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

    if ($wrapper.outerWidth() >= 400) config.options.aspectRatio = 1.2;
    if ($wrapper.outerWidth() >= 600) config.options.aspectRatio = 1.4;

    let ctx = $canvas.getContext('2d');
    window.myChart = new Chart(ctx, config);
  }

  const loadData = () => {
    $.getJSON("data/data.json", function(data){
      gData = data;
      drawTransitionChart();
      drawRegionChart("", 1000);
      drawJapanMap();
      drawDemographicChart();
      $("#container").addClass("show");
    })
  }

  const bindEvents = () => {
    $("#transition-block").find(".switch").on("click",function(){
      $("#transition-block").find(".switch").removeClass("selected");
      $(this).addClass("selected");
      drawTransitionChart();
    });
  }

  loadData();
  bindEvents();
};


$(function(){
  init();
});
