let gData;
let gRegions = [];

const LAST_DATE = "2020-02-26T00:00:00+09:00";
const AGE_LABELS = ["80代","70代","60代","50代","40代","30代","20代","10代","10歳未満"];
const COLORS = {
  default: "#3dc",
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

  const drawRegionChart = () => {
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
      } else {
        cColors.push(COLORS.default);
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
        aspectRatio: 1.0,
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

    if ($wrapper.outerWidth() >= 400) config.options.aspectRatio = 1.2;
    if ($wrapper.outerWidth() >= 600) config.options.aspectRatio = 1.4;

    let ctx = $canvas.getContext('2d');
    window.myChart = new Chart(ctx, config);
  }

  const drawJapanMap = () => {
    const getPrefColor = (name) => {
      let ret = "#666";
      gRegions.forEach(function(region, i){
        if (region.label === name) ret = COLORS.default;
      });
      return ret;
    }

    let width = $("#japan-map").width();
    let prefs = [
      {code:1,jp:"北海道",en:"Hokkaido",color:getPrefColor("北海道"),hoverColor:getPrefColor("北海道"),prefectures:[1]},
      {code:2,jp:"青森県",en:"Aomori",color:getPrefColor("青森県"),hoverColor:getPrefColor("青森県"),prefectures:[2]},
      {code:3,jp:"岩手県",en:"Iwate",color:getPrefColor("岩手県"),hoverColor:getPrefColor("岩手県"),prefectures:[3]},
      {code:4,jp:"宮城県",en:"Miyagi",color:getPrefColor("宮城県"),hoverColor:getPrefColor("宮城県"),prefectures:[4]},
      {code:5,jp:"秋田県",en:"Akita",color:getPrefColor("秋田県"),hoverColor:getPrefColor("秋田県"),prefectures:[5]},
      {code:6,jp:"山形県",en:"Yamagata",color:getPrefColor("山形県"),hoverColor:getPrefColor("山形県"),prefectures:[6]},
      {code:7,jp:"福島県",en:"Fukushima",color:getPrefColor("福島県"),hoverColor:getPrefColor("福島県"),prefectures:[7]},
      {code:8,jp:"茨城県",en:"Ibaraki",color:getPrefColor("茨城県"),hoverColor:getPrefColor("茨城県"),prefectures:[8]},
      {code:9,jp:"栃木県",en:"Tochigi",color:getPrefColor("栃木県"),hoverColor:getPrefColor("栃木県"),prefectures:[9]},
      {code:10,jp:"群馬県",en:"Gunma",color:getPrefColor("群馬県"),hoverColor:getPrefColor("群馬県"),prefectures:[10]},
      {code:11,jp:"埼玉県",en:"Saitama",color:getPrefColor("埼玉県"),hoverColor:getPrefColor("埼玉県"),prefectures:[11]},
      {code:12,jp:"千葉県",en:"Chiba",color:getPrefColor("千葉県"),hoverColor:getPrefColor("千葉県"),prefectures:[12]},
      {code:13,jp:"東京都",en:"Tokyo",color:getPrefColor("東京都"),hoverColor:getPrefColor("東京都"),prefectures:[13]},
      {code:14,jp:"神奈川県",en:"Kanagawa",color:getPrefColor("神奈川県"),hoverColor:getPrefColor("神奈川県"),prefectures:[14]},
      {code:15,jp:"新潟県",en:"Niigata",color:getPrefColor("新潟県"),hoverColor:getPrefColor("新潟県"),prefectures:[15]},
      {code:16,jp:"富山県",en:"Toyama",color:getPrefColor("富山県"),hoverColor:getPrefColor("富山県"),prefectures:[16]},
      {code:17,jp:"石川県",en:"Ishikawa",color:getPrefColor("石川県"),hoverColor:getPrefColor("石川県"),prefectures:[17]},
      {code:18,jp:"福井県",en:"Fukui",color:getPrefColor("福井県"),hoverColor:getPrefColor("福井県"),prefectures:[18]},
      {code:19,jp:"山梨県",en:"Yamanashi",color:getPrefColor("山梨県"),hoverColor:getPrefColor("山梨県"),prefectures:[19]},
      {code:20,jp:"長野県",en:"Nagano",color:getPrefColor("長野県"),hoverColor:getPrefColor("長野県"),prefectures:[20]},
      {code:21,jp:"岐阜県",en:"Gifu",color:getPrefColor("岐阜県"),hoverColor:getPrefColor("岐阜県"),prefectures:[21]},
      {code:22,jp:"静岡県",en:"Shizuoka",color:getPrefColor("静岡県"),hoverColor:getPrefColor("静岡県"),prefectures:[22]},
      {code:23,jp:"愛知県",en:"Aichi",color:getPrefColor("愛知県"),hoverColor:getPrefColor("愛知県"),prefectures:[23]},
      {code:24,jp:"三重県",en:"Mie",color:getPrefColor("三重県"),hoverColor:getPrefColor("三重県"),prefectures:[24]},
      {code:25,jp:"滋賀県",en:"Shiga",color:getPrefColor("滋賀県"),hoverColor:getPrefColor("滋賀県"),prefectures:[25]},
      {code:26,jp:"京都府",en:"Kyoto",color:getPrefColor("京都府"),hoverColor:getPrefColor("京都府"),prefectures:[26]},
      {code:27,jp:"大阪府",en:"Osaka",color:getPrefColor("大阪府"),hoverColor:getPrefColor("大阪府"),prefectures:[27]},
      {code:28,jp:"兵庫県",en:"Hyogo",color:getPrefColor("兵庫県"),hoverColor:getPrefColor("兵庫県"),prefectures:[28]},
      {code:29,jp:"奈良県",en:"Nara",color:getPrefColor("奈良県"),hoverColor:getPrefColor("奈良県"),prefectures:[29]},
      {code:30,jp:"和歌山県",en:"Wakayama",color:getPrefColor("和歌山県"),hoverColor:getPrefColor("和歌山県"),prefectures:[30]},
      {code:31,jp:"鳥取県",en:"Tottori",color:getPrefColor("鳥取県"),hoverColor:getPrefColor("鳥取県"),prefectures:[31]},
      {code:32,jp:"島根県",en:"Shimane",color:getPrefColor("島根県"),hoverColor:getPrefColor("島根県"),prefectures:[32]},
      {code:33,jp:"岡山県",en:"Okayama",color:getPrefColor("岡山県"),hoverColor:getPrefColor("岡山県"),prefectures:[33]},
      {code:34,jp:"広島県",en:"Hiroshima",color:getPrefColor("広島県"),hoverColor:getPrefColor("広島県"),prefectures:[34]},
      {code:35,jp:"山口県",en:"Yamaguchi",color:getPrefColor("山口県"),hoverColor:getPrefColor("山口県"),prefectures:[35]},
      {code:36,jp:"徳島県",en:"Tokushima",color:getPrefColor("徳島県"),hoverColor:getPrefColor("徳島県"),prefectures:[36]},
      {code:37,jp:"香川県",en:"Kagawa",color:getPrefColor("香川県"),hoverColor:getPrefColor("香川県"),prefectures:[37]},
      {code:38,jp:"愛媛県",en:"Ehime",color:getPrefColor("愛媛県"),hoverColor:getPrefColor("愛媛県"),prefectures:[38]},
      {code:39,jp:"高知県",en:"Kochi",color:getPrefColor("高知県"),hoverColor:getPrefColor("高知県"),prefectures:[39]},
      {code:40,jp:"福岡県",en:"Fukuoka",color:getPrefColor("福岡県"),hoverColor:getPrefColor("福岡県"),prefectures:[40]},
      {code:41,jp:"佐賀県",en:"Saga",color:getPrefColor("佐賀県"),hoverColor:getPrefColor("佐賀県"),prefectures:[41]},
      {code:42,jp:"長崎県",en:"Nagasaki",color:getPrefColor("長崎県"),hoverColor:getPrefColor("長崎県"),prefectures:[42]},
      {code:43,jp:"熊本県",en:"Kumamoto",color:getPrefColor("熊本県"),hoverColor:getPrefColor("熊本県"),prefectures:[43]},
      {code:44,jp:"大分県",en:"Oita",color:getPrefColor("大分県"),hoverColor:getPrefColor("大分県"),prefectures:[44]},
      {code:45,jp:"宮崎県",en:"Miyazaki",color:getPrefColor("宮崎県"),hoverColor:getPrefColor("宮崎県"),prefectures:[45]},
      {code:46,jp:"鹿児島県",en:"Kagoshima",color:getPrefColor("鹿児島県"),hoverColor:getPrefColor("鹿児島県"),prefectures:[46]},
      {code:47,jp:"沖縄県",en:"Okinawa",color:getPrefColor("沖縄県"),hoverColor:getPrefColor("沖縄県"),prefectures:[47]}
    ];

    $("#japan-map").japanMap({
      areas: prefs,
      width: width,
      borderLineColor: "#fcfcfc",
      borderLineWidth : 0.25,
      lineColor : "#ccc",
      lineWidth: 1,
      drawsBoxLine: false,
      showsPrefectureName: false,
      movesIslands : true,
      fontSize : 11
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
      drawRegionChart();
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
