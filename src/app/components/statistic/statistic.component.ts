import { StatisticApiService } from './../../services/statistic-api.service';
import { element } from 'protractor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-result',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  catalogConfig = [];
  view = [550, 450];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  xAxes: [{ stacked: true }];
  showLegend = true;
  legend = {
    display: true,

  }
  legendTitle = 'Title';
  legendPosition = 'bottom';
  showXAxisLabel = false;
  xAxisLabel = 'Test';
  showYAxisLabel = false;
  yAxisLabel = 'Catalogue Point';
  showGridLines = true;
  innerPadding = '5%';
  animations: boolean = true;
  barChart: any[] = [];
  series: any[] = [];
  isLoaded = false;
  load = false;
  //vertical bar chart
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#C7B42C']
  };

  multi = [];

  dataGroupChart: any;
  data = [];

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

  rankStattistic = [];
  dataEmployeeOverPoint: any;
  chooseConfig = [];
  counApi = 0;

  companyId = Number(localStorage.getItem('CompanyId'));
  ngOnInit() {
    this.isLoaded = false;
    this.load = false;
    this.GetGeneralStatistic(localStorage.getItem("AccountId"));
    this.GetRankStatistic(localStorage.getItem("AccountId"));
    this.GetOverallPointStatistic(this.companyId);
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  constructor(
    private historyApi: StatisticApiService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private router: Router,
  ) { }

  public loading = false;
  historyData: any;
  averageCatalogue = [];
  catalogues: [];

  GetGeneralStatistic(id) {
    this.loading = true
    this.series = [];
    this.historyApi.GetGeneralStatistic(id).subscribe(
      (data) => {
        this.historyData = data['items'];
        this.multi = [];
        var size = this.historyData[0].series.length;
        for (let i = 0; i < size; i++) {
          var series = [];
          this.historyData.forEach(element => {
            if (series.length < 5) {
              series.push({ name: element.name, value: element.series[i].value });
            }
          });
          var element = {
            name: this.historyData[0].series[i].name,
            series
          }
          this.averageCatalogue.push(element);
        }
        this.isLoaded = true;
        this.historyData.forEach(element => {
          let itemMulti = {
            name: element.name,
            series: [
              {
                name: "employees did the test ",
                value: element.numberOfFinishedTest,
              },
              {
                name: "employees didn't the test.",
                value: element.totalTest - element.numberOfFinishedTest
              }
            ]
          };
          if (this.multi.length < 5) {
            this.multi.push(itemMulti);
          }
          console.log(this.multi)
          let itemDropdown = {
            id: element.configId,
            text: element.name,
          };
          this.dropdownList.push(itemDropdown);
        });
        this.counApi++;
        if (this.counApi == 3) {
          this.isLoaded = true;
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        this.router.navigate(['/not-found']);
      }
    );
  }

  GetRankStatistic(id) {
    this.loading = true
    this.historyApi.GetRankStatistic(id).subscribe(
      (data) => {
        let tmp;
        tmp = data;
        for (var i = 0; i < tmp.length; i++) {
          tmp[i].series.push(tmp[i].tested);
          tmp[i].series.push(tmp[i].totalAccount);
        }
        this.dataGroupChart = tmp;
        this.counApi++;
        if (this.counApi == 3) {
          this.isLoaded = true;
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        this.router.navigate(['/not-found']);
      }
    );
  }

  GetOverallPointStatistic(id) {
    this.loading = true
    this.historyApi.GetOverallPointStatistic(id, true).subscribe(
      (data) => {
        this.dataEmployeeOverPoint = data;
        console.log(this.dataEmployeeOverPoint)
        this.counApi++;
        if (this.counApi == 3) {
          this.isLoaded = true;
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        this.router.navigate(['/not-found']);
      }
    );
  }

  onSelect(modal, evt) {
    this.modalService.open(modal, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }).catch((error) => {
    });
  }

  getDataStatistic(value) {
    this.chooseConfig.push(value);
    console.log(this.selectedItems)

  }

  onItemDeSelect(value) {
    for (let i = 0; i < this.chooseConfig.length; i++) {
      if (this.chooseConfig[i].id == value.id) {
        this.chooseConfig.splice(i, 1);
        break;
      }
    }
  }

  onSelectAll(value) {
    console.log(this.selectedItems)
  }

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
}
