import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatisticComponent } from './statistic.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { StatisticRoutingModule } from './statistic-routing.module';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { NgxLoadingModule } from 'ngx-loading';
import { FusionChartsModule } from 'angular-fusioncharts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    StatisticRoutingModule,
    Ng2Charts,
    NgxChartsModule,
    NgxLoadingModule.forRoot({}),
    NgMultiSelectDropDownModule.forRoot()
  ],
  
  declarations: [StatisticComponent]
})
export class StatisticModule { }