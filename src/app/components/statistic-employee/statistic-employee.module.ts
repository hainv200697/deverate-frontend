import { StatisticEmployeeRoutingModule } from './statistic-employee-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatisticEmployeeComponent } from './statistic-employee.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataTableModule } from 'ng-angular8-datatable';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    StatisticEmployeeRoutingModule,
    DataTableModule,
    NgxChartsModule,
    NgxLoadingModule,
  ],
  
  declarations: [StatisticEmployeeComponent]
})
export class StatisticEmployeeModule { }