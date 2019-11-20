import { element } from 'protractor';

declare var d3: any;
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { RankApiService } from 'src/app/services/rank-api.services';
import { StatisticApiService } from 'src/app/services/statistic-api.service';
import { ActivatedRoute } from '@angular/router';
import { RadialChartOptions } from 'chart.js';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  gaugeType = "semi";
  gaugeValue = 28.3;
  gaugeLabel = "Speed";
  gaugeAppendText = "km/hr";
  showRank: number;
  test = "";

  public loading = false;
  gaugemap = {};
  public powerGauge: any;
  statistic: any;
  catalogueInStatistic = [];
  pointRank: any;
  selectedDevice = "";
  catalogueInRanks: any;
  catalogue: any;
  catalogueTable: any;
  catalogueOverpoint: any;
  catalogueInConfigs: any;
  datasource: {};
  accountInfo;
  isLogin;
  isLoaded;
  roleName;

  constructor(private rankApi: RankApiService,
    private statisticApi: StatisticApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isLoaded = false;
    var testId = this.route.snapshot.paramMap.get('testId');
    this.getStatistic(Number(testId), 1);
    this.getAccountInfo(testId);
    this.isLogin = localStorage.getItem('isLoggedin');
    this.roleName = localStorage.getItem('Role');
    console.log(localStorage.getItem('Role'))
  }

  getAccountInfo(testId){
    this.loading = true;
    this.statisticApi.GetAccountByTestId(testId).subscribe(
      (data) => {
        this.accountInfo = data;
        this.loading = false;
      }
    )
  }

  getStatistic(id: number, rankId: number) {
    this.showRank = 0;
    this.loading = true;

    this.statisticApi.getStatistic(id).subscribe(
      (data) => {
        this.statistic = data['data']['data'];
        let tes = data['data']['data'].catalogueInRanks;

        this.catalogueInRanks = tes;

        this.catalogueOverpoint = data['data']['data'].catalogues;
        this.pointRank = data['data']['data'].configurationRanks;
        this.catalogueTable = data['data']['data'].catalogueInConfigs;
        let dialValue = data['data']['data'].rank;
        console.log(dialValue)

        for (var i = 0; i < this.catalogueInRanks.length; i++) {
          var chartDateElement = {
            data: [],
            label: '',
            hidden: true
          }
          this.catalogue = this.catalogueInRanks[i].catalogues
          chartDateElement.label = this.catalogueInRanks[i].rank
          if (chartDateElement.label === dialValue) {
            chartDateElement.hidden = false;
            var length = this.radarChartData.length;
            if (this.radarChartData.length > 1) {
              this.radarChartData[length - 1].hidden = false;
            }
          }
          for (var j = 0; j < this.catalogue.length; j++) {
            chartDateElement.data.push(this.catalogue[j].thresholdPoint);
            for (var z = 0; z < this.catalogueOverpoint.length; z++) {
              if (this.catalogue[j].CatalogueId == this.catalogueOverpoint[z].CatalogueId) {
                this.catalogue[j].overallPoint = this.catalogueOverpoint[z].overallPoint;
                this.catalogueTable[j].overallPoint = this.catalogueOverpoint[z].overallPoint;
              }
            }
          }
          this.radarChartData.push(chartDateElement);
        }

        for (var a = 0; a < this.catalogue.length; a++) {
          this.radarChartLabels.push(this.catalogue[a].name);
          this.radarChartData[0].data.push(this.catalogue[a].overallPoint)
        }
        console.log(this.radarChartData);

        this.datasource = {
          "chart": {
            "caption": "",
            "baseFontSize": "15",
            "gaugeOuterRadius": "140",
            "gaugeInnerRadius": "90",
            "lowerLimit": "0",
            "upperLimit": "100",
            "showValue": "1",
            "numberSuffix": "",
            "theme": "fusion",
            "showToolTip": "1",
            // "theme": "fint",
            "showGaugeBorder": "1",
            "pivotFillType": "linear",
            "chartBottomMargin": "30",
            "showTickMarks": "0",
            "showTickValues": "0"
          },
          "colorRange": {
            "color": [{
              "minValue": data['data']['data'].configurationRanks[3].point,
              "maxValue": data['data']['data'].configurationRanks[2].point,
              "code": "#F2726F",
            }, {
              "minValue": data['data']['data'].configurationRanks[2].point,
              "maxValue": data['data']['data'].configurationRanks[1].point,
              "code": "#FFC533",
            }, {
              "minValue": data['data']['data'].configurationRanks[1].point,
              "maxValue": data['data']['data'].configurationRanks[0].point,
              "code": "#00CC00",
            }, {
              "minValue": data['data']['data'].configurationRanks[0].point,
              "maxValue": data['data']['data']['point'],
              "code": "#62B58F",
            },
            ]
          },
          "trendPoints": {
            "point": [
              {
                "startValue": data['data']['data'].configurationRanks[3].point,
                "color": "#0075c2",
                "dashed": "3",
                "displayValue": "dev0",
              },
              {
                "startValue": data['data']['data'].configurationRanks[2].point,
                "color": "#0075c2",
                "dashed": "3",
                "displayValue": "dev1",
              },
              {
                "startValue": data['data']['data'].configurationRanks[1].point,
                "color": "#0075c2",
                "dashed": "1",
                "displayValue": "dev2",
              },
              {
                "startValue": data['data']['data'].configurationRanks[0].point,
                "color": "#0075c2",
                "dashed": "2",
                "displayValue": "dev3"
              },
            ]
          },
          "dials": {
            "dial": [{
              "value": data['data']['data']['point'],
              "showValue": "0",
              "valueFontSize": "25"

            }]
          },
          "annotations": {
            "origw": "100",
            "origh": "100",
            "autoscale": "1",
            "showBelow": "0",
            "groups": [{
              "id": "arcs",
              "items": [
                {
                  "id": "store-cs-bg",
                  "type": "",
                  "x": "$chartCenterX-130",
                  "y": "$chartEndY - 22",
                  "tox": "$chartCenterX + 150",
                  "toy": "$chartEndY - 2",
                  "fillcolor": "#0075c2"
                },
                {
                  "id": "state-cs-text",
                  "type": "Text",
                  "color": "black",
                  "label": "Overall point:" + (data['data']['data']['point']),
                  "fontSize": "18",
                  "background-color": "#ffffff",
                  "align": "center",
                  "x": "$chartCenterX",
                  "y": "$chartEndY - 12"
                }
              ]
            }]
          }
        }
        this.loading = false;
        this.isLoaded = true;
      },
    );

  }

  // Radar

  public radarChartLabels: string[] = [];


  public radarChartData: any = [
    { data: [], label: 'Assement Result' },
  ];
  
  public radarChartOption : RadialChartOptions = {
    scale: {
      ticks: {
        beginAtZero: true,
        stepSize : 10,
        max: 100
      }
    }
}

  public radarChartColor = [
    {
      fill: true,
      hoverBackgroundColor: "#FF0",
      borderColor: "rgb(29, 138, 198)",
      hoverBorderColor: "#00F",
      strokeColor: "rgb(29, 138, 198)",
      pointBorderColor: "rgba(133, 0, 97, 1)",
    },
    {
      borderColor: "rgb(78, 144, 114)",
      fill: false,
      strokeColor: "rgb(78, 144, 114)",
      pointBorderColor: "rgba(133, 0, 97, 1)",

    },
    {
      borderColor: "rgb(0, 204, 0)",
      fill: false,
      strokeColor: "rgb(0, 204, 0)",
      pointBorderColor: "rgba(133, 0, 97, 1)",
    },
    {
      borderColor: "rgb(204, 157, 40)",
      fill: false,
      strokeColor: "rgb(204, 157, 40)",
      pointBorderColor: "rgba(133, 0, 97, 1)",
    },
    {
      borderColor: "rgb(242, 114, 111)",
      fill: false,
      strokeColor: "rgb(242, 114, 111)",
      pointBorderColor: "rgba(133, 0, 97, 1)",
    }

  ]

  public radarChartType: string = 'radar';

  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean;
  public lineChartType: string;
  // console.log(e);
}