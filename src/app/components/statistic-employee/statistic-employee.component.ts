import { element } from 'protractor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StatisticApiService } from './../../services/statistic-api.service';

@Component({
  selector: 'app-statistic-employee',
  templateUrl: './statistic-employee.component.html',
  styleUrls: ['./statistic-employee.component.scss']
})
export class StatisticEmployeeComponent implements OnInit {

  dataLineChart
  accountId = Number(localStorage.getItem('AccountId'));
  result = [];
  isLoaded = false;
  dataHistory;
  averageCatalogue = [];
  ngOnInit() {
    this.getHistory(3);
  }

  constructor(
    private historyApi: StatisticApiService,
  ) { }

  getHistory(itemSelect) {
    this.historyApi.getHistory(this.accountId).subscribe(
      (data) => {
        this.dataLineChart = data['data']['data'];
        var size = this.dataLineChart[0].series.length;
        this.averageCatalogue = [];
        if (itemSelect == 3) {
          for (let i = 0; i < size; i++) {
            var series = [];
            this.dataLineChart.forEach(element => {
              series.push({ name: element.name, value: element.series[i].value });
            });
            var element = {
              name: this.dataLineChart[0].series[i].name,
              series
            }
            this.averageCatalogue.push(element);
          }
        }
        if(itemSelect == 2){
          var series = [];
          for (let i = 0; i < this.dataLineChart.length; i++) {
            
            this.dataLineChart.forEach(element => {
              series.push({ name: element.name, value: element.point });
            });
            
            
          }
          this.averageCatalogue.push({
            name : "Over Point",
            series});
          console.log(this.averageCatalogue)
        }
        if(itemSelect == 1){

        }

        this.isLoaded = true;
      },
      (error) => {

      }
    );

  }
  public view: any[] = [1300, 400];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = true;
  public xAxisLabel: "Years";
  public showYAxisLabel = true;
  public yAxisLabel: "Salary";
  public graphDataChart: any[];
  public colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

}
