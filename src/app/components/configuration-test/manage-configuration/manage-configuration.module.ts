
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageConfigurationComponent } from './manage-configuration.component';
import { PageHeaderModule } from '../../../shared';
import { ManageConfigurationRoutingModule } from './manage-configuration-routing.module';
import {TooltipModule} from "ngx-tooltip";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DataTableModule } from 'ng-angular8-datatable';
import { CompanyFilterPipe } from './company-filter.pipe';
import { ToastrModule } from 'ngx-toastr';
import {AngularDateTimePickerModule} from 'angular2-datetimepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { from } from 'rxjs';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    ManageConfigurationRoutingModule,
    PageHeaderModule,
    TooltipModule,
    SweetAlert2Module.forRoot(),
    SweetAlert2Module,
    SweetAlert2Module.forChild({}),
    DataTableModule,
    ToastrModule.forRoot(),
    AngularDateTimePickerModule,
    AngularMultiSelectModule
  ],
  
  declarations: [ManageConfigurationComponent,CompanyFilterPipe]
})
export class ManageConfigurationModule { }