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
    private modalService: NgbModal,
    private toast: ToastrService,
    private router: Router,
    private gblServices: GobalService,
    private datepipe: DatePipe,
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
  applicantList = [
    {
      fullName : 'thong',
      rank : 'dev1',
      point : 50,
      email : 'thongnd21@gamil.com'
    },
    {
      fullName : 'huy',
      rank : 'dev2',
      point : 80,
      email : 'thongnd21@gamil.com'
    },
    {
      fullName : 'hai',
      rank : 'unrank',
      point : 40,
      email : 'thongnd21@gamil.com'
    }
  ];
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
  dataGourp: any[] = [
    {
      "name": "Total applicant",
      "series": [
        {
          "name": "Total",
          "value": 17
        },
        {
          "name": "Pending",
          "value": 10
        },
        {
          "name": "Submited",
          "value": 5
        },
        {
          "name": "Expired",
          "value": 2
        }
      ]
    }
  ];
  xAxisGroupLabel: string = 'Country';
  yAxisGroupLabel: string = 'Population';
  legendGroupTitle: string = 'Years';
  colorGroupScheme = {
    domain: ['Green', 'Blue', '#990000', 'Red']
  };
  // import excel
  header = ["FullName", "Rank", "Point", "Email"]

  ngOnInit() {
    this.current = this.momentToOpjectDate(moment());
    this.loading = false;
    this.getConfig();
  }

  getConfig() {
    this.loading = true
    this.configApi.getConfigForApplicant(false, this.companyId).subscribe(
      (data) => {
        this.listConfig = data;
        this.setFilter(0);
        this.changeLineChart();
        this.changePieChart();
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
    const date = moment.utc(this.listConfig[index].startDate).local();
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

  getApplicant(input) {
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
  }

  generateExcel() {
    let title = "ListApplicant";
    let data = [];
    this.applicantList.forEach(element => {
      data.push(
        [
          element.fullName,
          element.rank,
          element.point,
          element.email
        ]
      );
    });
    this.excelService.generateExcel(this.header,data,title);
  }

}
