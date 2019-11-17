import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicantComponent } from './applicant.component';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'ng-angular8-datatable';
import { PageHeaderModule } from 'src/app/shared';
import { ApplicantRoutingModule } from './applicant-routing.module';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
    imports: [
      CommonModule,
    NgbModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    PageHeaderModule,
    ApplicantRoutingModule,
    NgbTooltipModule,
    NgxLoadingModule
    ],
    declarations: [
      ApplicantComponent
      ]
})
export class ApplicantModule {}
