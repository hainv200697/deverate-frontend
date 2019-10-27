
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatisticApiService } from 'src/app/services/statistic-api.service';

@Component({
  selector: 'app-result',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  view = [1100,500];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Legend';
  legendPosition = 'right';
  showXAxisLabel = true;
  xAxisLabel = 'Test';
  showYAxisLabel = true;
  yAxisLabel = 'Catalogue Point';
  showGridLines = true;
  innerPadding = '10%';
  animations: boolean = true;
  barChart: any[] = barChart;
  lineChartSeries: any[] = lineChartSeries;
  lineChartScheme = {
    name: 'coolthree',
    selectable: true,
    group: 'Ordinal',
    domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5']
  };

  comboBarScheme = {
    name: 'singleLightBlue',
    selectable: true,
    group: 'Ordinal',
    domain: ['#01579b']
  };

  showRightYAxisLabel: boolean = true;
  yAxisLabelRight: string = 'Average Point';

  ngOnInit() {
    this.lineChartLegend = true;
    this.lineChartType = 'line';
    this.getHistory(sessionStorage.getItem("AccountId"));
  }

  constructor(
    private historyApi: StatisticApiService) { }

  public loading = false;
  historyData: any;
  catalogues: [];
  multi: any;

  getHistory(id) {
    this.loading = true
    
    this.historyApi.getHistory(id).subscribe(
      (data) => {
        this.historyData = data['data']['data'];
        for (var i = 0; i < this.historyData.length; i++) {
          this.lineChartLabels.push(this.historyData[i].createDate.split('T')[0]);
          this.lineChartData[0].data.push(this.historyData[i].point * 5)
          this.lineChartData[0].label = "Assement Result"
        }
        this.loading = false;
        this.multi = [
          {
            "name": this.historyData[1].title,
            "series": [
              {
                "name": "2018",
                "value": 2243772
              },
              {
                "name": "2017",
                "value": 1227770
              }
            ]
          },
        ]
      }
    );
  }

  public lineChartData: Array<any> = [
    { data: [], label: '' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    // { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
  ];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: '#0000FF',
      pointBackgroundColor: '#FF0000',
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

}

export let lineChartSeries = [
  {
    name: 'Tablets',
    series: [
          {
      name: 'USA',
      value: 50
    },
      {
        value: 80,
        name: 'United Kingdom'
      },
      {
        value: 85,
        name: 'France'
      },
      {
        value: 90,
        name: 'Japan'
      },
      {
        value: 100,
        name: 'China'
      }
    ]
  },
    {
    name: 'Cell Phones',
    series: [
          {
      value: 10,
      name: 'USA'
    },
      {
        value: 20,
        name: 'United Kingdom'
      },
      {
        value: 30,
        name: 'France'
      },
      {
        value: 40,
        name: 'Japan'
      },
      {
        value: 10,
        name: 'China'
      }
    ]
  },
    {
    name: 'Computers',
    series: [
          {
      value: 2,
      name: 'USA',

    },
      {
        value: 4,
        name: 'United Kingdom'
      },
      {
        value: 20,
        name: 'France'
      },
      {
        value: 30,
        name: 'Japan'
      },
      {
        value: 35,
        name: 'China'
      }
    ]
  }
];

export let barChart: any = [
  {
    name: 'USA',
    value: 50000
  },
  {
    name: 'United Kingdom',
    value: 30000
  },
  {
    name: 'France',
    value: 10000
  },
  {
    name: 'Japan',
    value: 5000
  },
  {
    name: 'China',
    value: 500
  }
];