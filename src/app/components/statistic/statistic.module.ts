import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatisticComponent } from './statistic.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { StatisticRoutingModule } from './statistic-routing.module';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { GaugeModule } from 'angular-gauge';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxLoadingModule } from 'ngx-loading';
import { FusionChartsModule } from 'angular-fusioncharts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ComboChartComponent, ComboSeriesVerticalComponent } from '../combo-chart';


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
    NgxChartsModule,
    NgxLoadingModule.forRoot({}),
    NgMultiSelectDropDownModule.forRoot()
  ],
  
  declarations: [StatisticComponent,ComboChartComponent, ComboSeriesVerticalComponent]
})
export class StatisticModule { }