import { ConfigurationApiService } from './../../services/configuration-api.service';
import { StatisticApiService } from './../../services/statistic-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GobalService } from 'src/app/shared/services/gobal-service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ExcelService } from './../../shared/services/excel.service';
@Component({
  selector: 'statistic-applicant',
  templateUrl: './statistic-applicant.component.html',
  styleUrls: ['./statistic-applicant.component.scss']
})

export class StatisticApplicantComponent implements OnInit {
  constructor(
    private historyApi: StatisticApiService,
    private configApi: ConfigurationApiService,
    private excelService: ExcelService
  ) { }
  startDate;
  filter = {
    configId: 0,
    from: null,
    to: null
  };
  configId;
  minDate;
  current;
  endDate;
  listConfig = [];
  applicantList;
  loading = false;
  companyId = Number(localStorage.getItem('CompanyId'));
  // Pie chart
  valuePieChart;
  colorScheme = {
    domain: ['#08DDC1', '#FFDC1B', '#FF5E3A']
  };
  view: any[] = [700, 300];
  legendTitle = "Rank";
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  // item duplicate 
  showLegend = true;
  // Line chart
  viewLine: any[] = [700, 400];
  colorLineScheme = {
    domain: ['Red', 'Blue', '#990000', 'Purple', 'Teal', 'Fuchsia', 'Maroon', 'Olive', 'Yellow', 'Lime', 'Green', 'Navy', 'White', 'Black']
  };
  legendLineTitle = "Catalogue";
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel: "Rank";
  showYAxisLabel = true;
  yAxisLabel: "Average Point";
  graphDataChart: any[];
  valueLineChart;
  // Group chart
  dataGourp = [
    {
      name: "Total Applicant",
      series: []
    }
  ];
  yAxisGroupLabel: string = 'People';
  legendGroupTitle: string = '';
  colorGroupScheme = {
    domain: ['Blue', '#FFA500', 'Green', 'Red']
  };
  // import excel
  header = ["FullName", "Rank", "Point", "Email","Create Date"];
  groupReady = false;
  noData: boolean;

  ngOnInit() {
    this.current = this.momentToOpjectDate(moment());
    this.loading = false;
    this.getConfig();
  }

  getConfig() {
    this.loading = true
    this.noData = false;
    this.configApi.getConfigForApplicant(false, this.companyId).subscribe(
      (data) => {
        if(data.length != 0){
          this.listConfig = data;
          this.setFilter(0);
          this.changeLineChart();
          this.changePieChart();
          this.changeApplicantResult();
          this.changeGroupStatusTest();
        }else{
          this.noData = true;
        }
        this.loading = false;
      }
      , (error) => {
        this.loading = false;
      }
    );
  }

  setFilter(index) {
    this.configId = this.listConfig[index].configId;
    this.filter.configId = this.listConfig[index].configId;
    const date = moment.utc(this.listConfig[index].createDate).local();
    this.minDate = this.momentToOpjectDate(date);
    this.startDate = this.minDate;
    this.endDate = this.momentToOpjectDate(moment());
  }

  changeLineChart() {
    this.loading = true;
    this.historyApi.GetCatalogueStatisticApplicant(this.filter).subscribe(
      (data) => {
        this.valueLineChart = data;
        this.loading = false;
      }
      , (error) => {
        this.loading = false;
      }
    );
  }

  changePieChart() {
    this.loading = true;
    this.historyApi.GetRankStatisticApplicant(this.filter).subscribe(
      (data) => {
        this.valuePieChart = data;
        this.loading = false;
      }
      , (error) => {
        this.loading = false;
      }
    );
  }

  changeApplicantResult() {
    this.loading = true;
    this.historyApi.GetApplicantResult(this.filter).subscribe(
      (data) => {
        this.applicantList = data;
        console.log(this.applicantList);
        this.loading = false;
      }
      , (error) => {
        this.loading = false;
      }
    );
  }

  changeGroupStatusTest() {
    this.loading = true;
    this.groupReady = false;
    this.historyApi.GetGroupStatusTest(this.filter).subscribe(
      (data) => {
        this.dataGourp[0].series = data;
        this.groupReady = true;
        this.loading = false;
      }
      , (error) => {
        this.loading = false;
      }
    );
  }

  changeConfig() {
    const index = this.listConfig.findIndex(x => x.configId == this.configId);
    this.setFilter(index);
    this.filter = {
      configId: this.configId,
      from: null,
      to: null
    };
    this.changeLineChart();
    this.changePieChart();
    this.changeApplicantResult();
    this.changeGroupStatusTest();
  }

  momentToOpjectDate(date) {
    return {
      year: date.year(),
      month: date.month() + 1,
      day: date.date()
    }
  }
  changeDate() {
    let startMonth = this.startDate.month
    if (startMonth < 10) {
      startMonth = '0' + startMonth;
    }
    let startDay = this.startDate.day
    if (startDay < 10) {
      startDay = '0' + startDay;
    }
    let endMonth = this.endDate.month
    if (endMonth < 10) {
      endMonth = '0' + endMonth;
    }
    let endDay = this.endDate.day
    if (endDay < 10) {
      endDay = '0' + endDay;
    }
    this.filter = {
      configId: this.configId,
      from: this.startDate.year + '-' + startMonth + '-' + startDay + 'T00:00:01.000+07:00',
      to: this.endDate.year + '-' + endMonth + '-' + endDay + 'T23:59:59.000+07:00',
    };
    this.changeLineChart();
    this.changePieChart();
    this.changeApplicantResult();
    this.changeGroupStatusTest();
  }

  generateExcel() {
    let title = "Applicant Result";
    let data = [];
    this.applicantList.forEach(element => {
      data.push(
        [
          element.fullName,
          element.rank,
          element.point,
          element.email,
          element.createDate
        ]
      );
    });
    this.excelService.generateExcel(this.header,data,title);
  }

}
