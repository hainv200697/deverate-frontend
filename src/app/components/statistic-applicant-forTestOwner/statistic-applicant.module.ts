import { StatisticApplicantRoutingModule } from './statistic-applicant-routing.module';
import { StatisticApplicantComponent } from './statistic-applicant.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataTableModule } from 'ng-angular8-datatable';
import { DatePipe } from '@angular/common';
import { ExcelService } from './../../shared/services/excel.service';

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
    DataTableModule,
  ],
  providers: [DatePipe],
  declarations: [StatisticApplicantComponent]
})
export class StatisticApplicantModule { }