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

  multi = [];

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
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
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
    this.series = [];
    let test: any;
    this.historyApi.GetGeneralStatistic(id).subscribe(
      (data) => {
        this.historyData = data['items'];
        this.multi= [];
        this.historyData.forEach(element => {
          let itemMulti = {
            name : element.name,
            series : [
              {
                name :"làm test",
                value: element.numberOfFinishedTest
              },
              {
                name: "ko làm test",
                value: element.totalTest - element.numberOfFinishedTest
              }
            ]
          };
          this.multi.push(itemMulti);
          let itemDropdown = {
            id : element.configId,
            text : element.name,
          };
          this.dropdownList.push(itemDropdown);
        });
        console.log(this.dropdownList);
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

  getDataStatistic(value){
    console.log(value);
  }

  onSelectAll(value){
    console.log(value);
  }

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
}