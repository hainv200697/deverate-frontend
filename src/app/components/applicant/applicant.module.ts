import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicantComponent } from './applicant.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'ng-angular8-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderModule } from 'src/app/shared';
import { ApplicantRoutingModule } from './applicant-routing.module';
import { TooltipModule } from 'ngx-tooltip';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
    imports: [
      CommonModule,
    NgbModule,
    FormsModule,
    DataTableModule,
    TranslateModule,
    ReactiveFormsModule,
    PageHeaderModule,
    ApplicantRoutingModule,
    TooltipModule,
    NgxLoadingModule
    ],
    declarations: [
      ApplicantComponent
      ]
})
export class ApplicantModule {}
