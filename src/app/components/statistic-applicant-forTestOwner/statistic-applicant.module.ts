import { StatisticApplicantRoutingModule } from './statistic-applicant-routing.module';
import { StatisticApplicantComponent } from './statistic-applicant.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { NgxLoadingModule } from 'ngx-loading';
import { FusionChartsModule } from 'angular-fusioncharts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DataTableModule } from 'ng-angular8-datatable';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    StatisticApplicantRoutingModule,
    Ng2Charts,
    NgxChartsModule,
    NgxLoadingModule.forRoot({}),
    NgMultiSelectDropDownModule.forRoot(),
    DataTableModule,
  ],
  
  declarations: [StatisticApplicantComponent]
})
export class StatisticApplicantModule { }