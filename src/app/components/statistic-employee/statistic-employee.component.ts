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
  loading = false;
  dataHistory;
  averageCatalogue = [];
  lo
  ngOnInit() {
    this.getHistory(2);
  }

  constructor(
    private historyApi: StatisticApiService,
    private toast: ToastrService,
  ) { }

  getHistory(itemSelect) {
    this.loading = true;
    this.historyApi.getHistory(this.accountId).subscribe(
      (data) => {
        this.dataLineChart = data;
        var size = this.dataLineChart[0].series.length;
        this.averageCatalogue = [];
        if (itemSelect == 3) {
          for (let i = 0; i < size; i++) {
            var series = [];
            this.dataLineChart.forEach(element => {
              series.push({ name: element.name, value: element.series[i].overallPoint });
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
        }
        if(itemSelect == 1){

        }
        this.loading = false;
        this.isLoaded = true;
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
  public view: any[] = [1150, 400];
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
    domain: ['Red', 'Blue', '#990000', 'Purple', 'Teal', 'Fuchsia', 'Maroon', 'Olive', 'Yellow', 'Lime', 'Green', 'Navy', 'White', 'Black']
  };

}
