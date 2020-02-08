import { element } from 'protractor';
import { ConfigurationApiService } from './../../services/configuration-api.service';
import { StatisticApiService } from './../../services/statistic-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-result',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
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
  legendPosition = 'right';
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
  dataRankStatistic;
  noData: boolean;

  companyId = Number(localStorage.getItem('CompanyId'));
  ngOnInit() {
    this.isLoaded = false;
    this.load = false;
    this.getConfig();
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
    private configApi: ConfigurationApiService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private router: Router,
  ) { }

  public loading = false;
  historyData: any;
  averageCatalogue = [];
  catalogues: [];
  selectData;

  GetGeneralStatistic(id) {
    this.loading = true
    this.series = [];
    this.historyApi.GetGeneralStatistic(id).subscribe(
      (data) => {
        this.historyData = data['items'];
        this.setAveragePointCatalogue();
        this.isLoaded = true;
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
        this.dataRankStatistic = data;
        this.setStatisticRank();
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

  getConfig() {
    this.loading = true;
    this.noData = false;
    this.configApi.getConfigForApplicant(true, this.companyId).subscribe(
      (data) => {
        if(data.length == 0){
          this.noData = true;
          this.loading = false;
          return;
        }
        let count = 1;
        data.forEach(element => {
          const item = { id: element.configId, text: element.title }
          this.dropdownList.push(item)
          if (count <= 5) {
            this.selectedItems.push(item);
            count++;
          }
        });
        this.selectData = this.selectedItems[0].id;
        this.GetGeneralStatistic(localStorage.getItem("AccountId"));
        this.GetRankStatistic(localStorage.getItem("AccountId"));
        this.GetOverallPointStatistic(true);
      }
      , (error) => {
        this.loading = false;
        this.router.navigate(['/not-found']);
      }
    );
  }

  GetOverallPointStatistic(checkCount) {
    this.loading = true
    this.historyApi.GetOverallPointStatistic(this.companyId, this.selectData, true).subscribe(
      (data) => {
        this.dataEmployeeOverPoint = data;
        this.counApi++;
        if (this.counApi == 3 && checkCount == true) {
          this.isLoaded = true;
          this.loading = false;
        }
        else if (checkCount == false) {
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
  }

  Apply() {
    this.selectData = this.selectedItems[0].id;
    this.GetOverallPointStatistic(false);
    this.setAveragePointCatalogue();
    this.setStatisticRank();
  }

  setStatisticRank(){
    this.dataGroupChart = [];
    this.selectedItems.forEach(select => {
      const element = this.dataRankStatistic.find(x=> x.configId == select.id);
      this.dataGroupChart.push(element);
    });
  }

  setAveragePointCatalogue() {
    var size = this.historyData[0].series.length;
    this.averageCatalogue = []
    for (let i = 0; i < size; i++) {
      var series = [];
      this.selectedItems.forEach(select => {
        const element = this.historyData.find(x => x.configId === select.id);
        series.push({ name: element.name, value: element.series[i].value });
      });
      var element = {
        name: this.historyData[0].series[i].name,
        series
      }
      this.averageCatalogue.push(element);
    }

  }
}
