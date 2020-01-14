import { ConfigurationApiService } from './../../services/configuration-api.service';
import { StatisticApiService } from './../../services/statistic-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GobalService } from 'src/app/shared/services/gobal-service';
import { DatePipe } from '@angular/common';

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
    private datepipe: DatePipe
  ) { }
  startDate;
  endDate;
  current;
  listConfig = [];
  applicantList = [];
  configId = 0;
  loading = false;
  companyId = Number(localStorage.getItem('CompanyId'));
  // Pie chart
  data = [
    { 'name': "dev1", 'value': 9 },
    { 'name': "dev2", 'value': 10 },
    { 'name': "dev3", 'value': 5 }
  ]
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
  value =
    [{
      "name": "cata1",
      "series": [
        {
          "name": "1/1/2016",
          "value": "15000"
        },
        {
          "name": "2/1/2016",
          "value": "20000"
        },
        {
          "name": "3/1/2016",
          "value": "25000"
        },
        {
          "name": "4/1/2016",
          "value": "30000"
        }
      ],
    },
    ]


  ngOnInit() {
    this.current = this.gblServices.stringToOpjectDate(this.datepipe.transform(Date.now(), 'yyyy-MM-dd'));
    this.endDate = this.current;
    this.loading = false;
    this.getConfig();
  }

  getConfig() {
    this.loading = true
    this.configApi.getConfigForApplicant(false, this.companyId).subscribe(
      (data) => {
        this.listConfig = data;
        this.configId = this.listConfig[0].configId;
        const date = this.listConfig[0].startDate.split('T', 1);
        this.startDate = this.gblServices.stringToOpjectDate(date[0]);
        console.log(this.startDate);
        this.loading = false;
      }
      , (error) => {
        this.loading = false;
      }
    );
  }

  changeLineChart(input) {
    console.log(input);
  }

  changePieChart(input) {
    console.log(input);
  }

  getApplicant(input) {
    console.log(input);
  }

  changeInput() {
    const start = this.changeObjDateToString(this.startDate);
    const end = this.changeObjDateToString(this.endDate);
    const input = {
      start : start,
      end   : end,
      configId : this.configId
    }
    this.changeLineChart(input);
    this.changePieChart(input);
    this.getApplicant(input);
  }

  changeObjDateToString(date) {
    const time = date.year + '-' + date.month + '-' + date.day;
    return time
  }

}
