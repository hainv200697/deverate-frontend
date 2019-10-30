import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatisticApiService } from 'src/app/services/statistic-api.service';

@Component({
  selector: 'app-result',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  view = [550, 450];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  xAxes: [{ stacked: true }];
  showLegend = true;
  legendTitle = 'Legend';
  legendPosition = 'right';
  showXAxisLabel = true;
  xAxisLabel = 'Test';
  showYAxisLabel = true;
  yAxisLabel = 'Catalogue Point';
  showGridLines = true;
  innerPadding = '5%';
  animations: boolean = true;
  barChart: any[] = [];
  series: any[] = [];
  //vertical bar chart
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };
  multi: any[] = [];
  // multi = [
  //   {
  //     "name": "Karthikeyan",
  //     "series": [
  //       {
  //         "name": "2016",
  //         "value": "15000"
  //       },
  //       {
  //         "name": "2017",
  //         "value": "20000"
  //       },
  //       {
  //         "name": "2018",
  //         "value": "25000"
  //       },
  //       {
  //         "name": "2019",
  //         "value": "30000"
  //       }
  //     ],
  //   },
  //   {
  //     "name": "Gnana Prakasam",
  //     "series": [
  //       {
  //         "name": "2016",
  //         "value": "4000"
  //       },
  //       {
  //         "name": "2017",
  //         "value": "4500"
  //       },
  //       {
  //         "name": "2018",
  //         "value": "10000"
  //       },
  //       {
  //         "name": "2019",
  //         "value": "15000"
  //       }
  //     ],
  //   },
  //   {
  //     "name": "Kumaresan",
  //     "series": [
  //       {
  //         "name": "2016",
  //         "value": "5000"
  //       },
  //       {
  //         "name": "2017",
  //         "value": "8000"
  //       },
  //       {
  //         "name": "2018",
  //         "value": "15000"
  //       },
  //       {
  //         "name": "2019",
  //         "value": "35000"
  //       }
  //     ],
  //   }
  
  // ];
  // data pie
  single = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];
  lineChartSeries: any[] = [];
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
  isLoaded;


  ngOnInit() {
    this.isLoaded = false;
    this.GetGeneralStatistic(sessionStorage.getItem("AccountId"));
    // this.getHistory(5);
  }

  constructor(
    private historyApi: StatisticApiService,
    private modalService: NgbModal,
  ) { }

  public loading = false;
  historyData: any;
  catalogues: [];

  GetGeneralStatistic(id) {
    this.loading = true
    this.multi = [];
    this.series = [];
    let test: any;
    this.historyApi.GetGeneralStatistic(id).subscribe(
      (data) => {
        this.historyData = data['items'];
        
        console.log(this.historyData);
        this.isLoaded = true;
        this.loading = false;
      }
    );
  }

  onSelect(modal, evt) {
    console.log(evt);
    this.modalService.open(modal, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }).catch((error) => {
    });
  }
}