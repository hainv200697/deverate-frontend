
declare var d3: any;
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { RankApiService } from 'src/app/services/rank-api.services';
import { StatisticApiService } from 'src/app/services/statistic-api.service';
import { ActivatedRoute } from '@angular/router';

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
  ListRank: [];
  statistic = [];
  catalogueInStatistic = [];
  pointRank: any;
  selectedDevice = "";
  catalogueInRanks: any;
  catalogue: any;
  catalogueTable: any;
  catalogueOverpoint: any;
  datasource: {}

  constructor(private rankApi: RankApiService,
    private statisticApi: StatisticApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getAllRank(true);
    var testId = this.route.snapshot.paramMap.get('testId');
    this.getStatistic(Number(testId), 1);
  }
  getAllRank(status: boolean) {
    this.loading = true;
    this.rankApi.getAllRank(status).subscribe(
      (data) => {
        this.ListRank = data['data']['data'];
        this.loading = false;
      }
    );

  }

  getStatistic(id: number, rankId: number) {
    this.showRank = 0;
    this.loading = true;

    this.statisticApi.getStatistic(id).subscribe(
      (data) => {
        this.statistic = data['data']['data'];
        this.catalogueInRanks = data['data']['data'].catalogueInRanks;
        this.catalogueOverpoint = data['data']['data'].catalogues;
        this.pointRank = data['data']['data'].configurationRanks;
        
        for (var i = 0; i < this.catalogueInRanks.length; i++) {
          this.catalogue = data['data']['data'].catalogueInRanks[i].catalogues
          this.radarChartData[i+1].label = this.catalogueInRanks[i].rank
          for (var j = 0; j < this.catalogue.length; j++) {
              this.radarChartData[i+1].data.push(this.catalogue[j].thresholdPoint * 100);
            for (var z = 0; z < this.catalogueOverpoint.length; z++) {
              if (this.catalogue[j].CatalogueId == this.catalogueOverpoint[z].CatalogueId) {
                this.catalogue[j].overallPoint = this.catalogueOverpoint[z].overallPoint;
              }
            }
          }
        }
        for(var a = 0; a < this.catalogue.length; a++){
          this.radarChartLabels.push(this.catalogue[a].name);
          this.radarChartData[0].data.push(this.catalogue[a].overallPoint *100)
        }
        this.catalogueTable = this.catalogue;
        console.log(this.catalogueInRanks)
        this.datasource = {
          "chart": {
            "caption": "",
            "baseFontSize": "18",
            "gaugeOuterRadius": "140",
            "gaugeInnerRadius": "90",
            "lowerLimit": "0",
            "upperLimit": "5",
            "showValue": "3",
            "numberSuffix": "",
            "theme": "fusion",
            "showToolTip": "1",
            // "theme": "fint",
            "showGaugeBorder": "1",
            "pivotFillType": "linear",
            "chartBottomMargin": "50",
          },
          "colorRange": {
            "color": [{
              "minValue": "0",
              "maxValue": this.pointRank[2].point * 5,
              "code": "#F2726F",
            }, {
              "minValue": this.pointRank[2].point * 5,
              "maxValue": this.pointRank[1].point * 5,
              "code": "#FFC533",
            }, {
              "minValue": this.pointRank[1].point * 5,
              "maxValue": this.pointRank[0].point * 5,
              "code": "#62B58F",
            }, {
              "minValue": this.pointRank[0].point * 5,
              "maxValue": "5",
              "code": "#00FF00",
            }]
          },
          "trendPoints": {
            "point": [
              {
                "startValue": 0,
                "color": "#0075c2",
                "dashed": "3",
                "displayValue": "dev0",
              },
              {
                "startValue": this.pointRank[2].point * 5,
                "color": "#0075c2",
                "dashed": "3",
                "displayValue": "dev1",
              },
              {
                "startValue": this.pointRank[1].point * 5,
                "color": "#0075c2",
                "dashed": "1",
                "displayValue": "dev2",
              },
              {
                "startValue": this.pointRank[0].point * 5,
                "color": "#0075c2",
                "dashed": "2",
                "displayValue": "dev3"
              },
              {
                "startValue": 5,
                "color": "#0075c2",
                "dashed": "2",
                "displayValue": "dev4"
              }
            ]
          },
          "dials": {
            "dial": [{
              "value": data['data']['data']['point'] * 5,
              "showValue": "1",
              "valueFontSize": "22"

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
                  "label": "Overall point:" + (data['data']['data']['point'] * 5),
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
        this.loading = false
      },
    );

  }

  onChangeRank(newValue) {

  }

  onChangeRankData(rankId) {
    this.catalogue = [];
    this.radarChartLabels = [];
    this.radarChartData = [
      { data: [], label: 'Assement Result' },
      { data: [], label: 'Threshold Point' }
    ];
    for (var i = 0; i < this.catalogueInRanks.length; i++) {
      if (rankId == this.catalogueInRanks[i].rankId) {
        this.catalogue = this.catalogueInRanks[i].catalogues
        for (var j = 0; j < this.catalogue.length; j++) {
          for (var z = 0; z < this.catalogueOverpoint.length; z++) {
            if (this.catalogue[j].CatalogueId == this.catalogueOverpoint[z].CatalogueId) {
              this.catalogue[j].overallPoint = this.catalogueOverpoint[z].overallPoint;
            }
          }
          this.radarChartLabels.push(this.catalogue[j].name);
          this.radarChartData[0].data.push(this.catalogue[j].overallPoint * 100);
          this.radarChartData[1].data.push(this.catalogue[j].thresholdPoint * 100);
        }
      }
    }
    console.log(this.catalogue)
  }

  // Radar

  public radarChartLabels: string[] = [];


  public radarChartData: any = [
    { data: [], label: 'Assement Result' },
    { data: [], label: '' },
    { data: [], label: '' },
    { data: [], label: '' },
  ];

  public radarChartColor = [
    {
      fill: true,
      hoverBackgroundColor: "#FF0",
      borderColor: "#0F0",
      hoverBorderColor: "#00F",
      strokeColor: "#0F0",
      pointBorderColor: "rgba(133, 0, 97, 1)",
    },
    {
      borderColor: "#ff0505",
      fill: false,
      strokeColor: "rgba(220,220,220,1)",
      pointBorderColor: "rgba(133, 0, 97, 1)",
    },
    {
      borderColor: "#0516ff",
      fill: false,
      strokeColor: "rgba(220,220,220,1)",
      pointBorderColor: "rgba(133, 0, 97, 1)",

    },
    {
      borderColor: "#ffdd1f",
      fill: false,
      strokeColor: "rgba(220,220,220,1)",
      pointBorderColor: "rgba(133, 0, 97, 1)",
    },

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

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }
}