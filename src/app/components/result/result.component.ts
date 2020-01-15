import { element } from 'protractor';

declare var d3: any;
import { Component, Output, EventEmitter, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { RadialChartOptions } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { RankApiService } from '../../services/rank-api.services';
import { StatisticApiService } from '../../services/statistic-api.service';

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
  countApi = 0;


  constructor(private rankApi: RankApiService,
    private statisticApi: StatisticApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.isLoaded = false;
    this.loading = true;
    var testId = this.route.snapshot.paramMap.get('testId');
    this.getAccountInfo(testId);

    this.getStatistic(Number(testId), 1);
    this.isLogin = localStorage.getItem('isLoggedin');
    this.roleName = localStorage.getItem('Role');
  }

  getAccountInfo(testId) {
    this.statisticApi.GetAccountByTestId(testId).subscribe(
      (data) => {
        this.accountInfo = data;
        if (this.accountInfo.applicantId != undefined &&
          this.accountInfo.applicantId != localStorage.getItem('applicantId') &&
          localStorage.getItem('Role') != 'Test Owner'
        ) {
          this.router.navigate(['**']);
          return;
        }
        if (this.accountInfo.AccountId != undefined &&
          this.accountInfo.AccountId != localStorage.getItem('AccountId') &&
          localStorage.getItem('Role') != 'Test Owner'
        ) {
          this.router.navigate(['**']);
          return;
        }
        if (this.accountInfo.fullname == undefined) {
          this.accountInfo.fullname = this.accountInfo.fullName;
        }
        this.countApi++;
        if (this.countApi == 2) {
          this.loading = false;
          this.isLoaded = true;
        }

      },
      (error) => {
        if (error.status == 0) {
          this.toast.error('Connection time out');
        }
        if (error.status == 404) {
          this.toast.error('Not found');
        }
        if (error.status == 500) {
          this.toast.error('Server error');
        }
        this.loading = false;
      }
    )
  }

  getStatistic(id: number, rankId: number) {
    this.showRank = 0;
    this.statisticApi.getStatistic(id).subscribe(
      (data) => {
        this.statistic = data;
        let tes = data.catalogueInRanks;

        this.catalogueInRanks = tes;

        this.catalogueOverpoint = data.catalogues;
        this.pointRank = data.configurationRanks;
        this.catalogueTable = data.catalogueInConfigs;
        let dialValue = data.rank;

        for (var i = 0; i < this.catalogueInRanks.length; i++) {
          var chartDateElement = {
            data: [],
            label: '',
            hidden: true
          }
          this.radarChartColor.push({
            borderColor: this.fusionChartColor[i + 1],
            pointBorderColor: "rgba(133, 0, 97, 1)",
          })
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
              if (this.catalogue[j].catalogueId == this.catalogueOverpoint[z].catalogueId) {
                this.catalogue[j].overallPoint = this.catalogueOverpoint[z].overallPoint;
              }
            }
          }
          this.radarChartData.push(chartDateElement);
        }
        for (var a = 0; a < this.catalogueOverpoint.length; a++) {
          this.radarChartLabels.push(this.catalogueOverpoint[a].name);
          this.radarChartData[0].data.push(this.catalogueOverpoint[a].overallPoint)
        }

        this.fusionChartAnotation.groups[0].items[1].label = "Overall point:" + this.statistic.point;
        var dataTest = {
          chart: this.fusionchart,
          colorRange: {
            color: [],
          },
          trendPoints: {
            point: [],
          },
          dials: {
            dial: [{
              value: this.statistic.point,
              showValue: "0",
              valueFontSize: "25"
            }],
          },
          annotations: this.fusionChartAnotation,
        }
        this.pointRank.unshift({
          rank : 'Not ranked',
          point: 0,
        })
        this.pointRank.push({
          point: 100,
        })
        for (var i = 0; i < this.pointRank.length - 1; i++) {

            dataTest.colorRange.color.push({
              minValue: this.pointRank[i].point,
              maxValue : this.pointRank[i + 1].point,
              code: this.fusionChartColor[i],
            })

          dataTest.trendPoints.point.push({
            startValue: this.pointRank[i].point,
            color: "#0075c2",
            displayValue: this.pointRank[i].rank,
          })
        }
        this.datasource = dataTest

        this.countApi++;
        if (this.countApi == 2) {
          this.loading = false;
          this.isLoaded = true;
        }
      },
      (error) => {
        if (error.status == 0) {
          this.toast.error('Connection time out');
        }
        if (error.status == 404) {
          this.toast.error('Not found');
        }
        if (error.status == 500) {
          this.toast.error('Server error');
        }
        this.loading = false;
      }
    );

  }

  // Radar

  public radarChartLabels: string[] = [];


  public radarChartData: any = [
    { data: [], label: 'Assement Result' },
  ];

  public radarChartOption: RadialChartOptions = {
    scale: {
      ticks: {
        beginAtZero: true,
        stepSize: 20,
        max: 100
      }
    }
  }

  public radarChartColor = [
    {
      borderColor: "rgb(29, 138, 198)",
      pointBorderColor: "rgba(133, 0, 97, 1)",
    },
  ]

  public radarChartType: string = 'radar';

  public fusionchart: any = {
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
    "showGaugeBorder": "1",
    "pivotFillType": "linear",
    "chartBottomMargin": "30",
    "showTickMarks": "0",
    "showTickValues": "0"
  }

  public fusionChartColor = ['#F2726F', '#FFC533', '#00CC00', '#62B58F','black','blue','gray'];

  public fusionChartAnotation: any = {
    origw: 100,
    origh: 100,
    autoscale: 1,
    showBelow: 0,
    groups: [{
      id: "arcs",
      items: [
        {
          id: "store-cs-bg",
          type: "",
          x: "$chartCenterX-130",
          y: "$chartEndY - 22",
          tox: "$chartCenterX + 150",
          toy: "$chartEndY - 2",
          fillcolor: "#0075c2"
        },
        {
          id: "state-cs-text",
          type: "Text",
          color: 'black',
          label: "",
          fontSize: "18",
          backgroundcolor: "#ffffff",
          align: "center",
          x: "$chartCenterX",
          y: "$chartEndY - 3"
        }
      ]
    }]
  }
}