
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatisticApiService } from 'src/app/services/statistic-api.service';

@Component({
  selector: 'app-result',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
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