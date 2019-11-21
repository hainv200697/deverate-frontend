import { ConfigurationFilterPipe } from './manage-configuration-applicant.pipe';
import { ManageConfigurationApplicantComponent } from './manage-configuration-applicant.component';
import { ManageConfigurationApplicantRoutingModule } from './manage-configuration-applicant-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DataTableModule } from 'ng-angular8-datatable';
import { ToastrModule } from 'ngx-toastr';
import {AngularDateTimePickerModule} from 'angular2-datetimepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { from } from 'rxjs';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ManageConfigurationApplicantRoutingModule,
    PageHeaderModule,
    SweetAlert2Module.forRoot(),
    SweetAlert2Module,
    SweetAlert2Module.forChild({}),
    DataTableModule,
    ToastrModule.forRoot(),
    AngularDateTimePickerModule,
    AngularMultiSelectModule,
    NgxLoadingModule.forRoot({})
  ],
  
  declarations: [ManageConfigurationApplicantComponent,ConfigurationFilterPipe]
})
export class ManageConfigurationApplicantModule { }