import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatisticComponent } from './statistic.component';


import { StatisticRoutingModule } from './statistic-routing.module';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { GaugeModule } from 'angular-gauge';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxLoadingModule } from 'ngx-loading';
import { FusionChartsModule } from 'angular-fusioncharts';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    StatisticRoutingModule,
    Ng2Charts,
    NgxGaugeModule,
    NgxLoadingModule.forRoot({})
  ],
  
  declarations: [StatisticComponent]
})
export class StatisticModule { }