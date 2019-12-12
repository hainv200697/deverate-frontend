import { PageHeaderModule } from './../../shared/modules/page-header/page-header.module';
import { SemesterRoutingModule } from './semester-routing.module';
import { SemesterComponent } from './semester.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'ng-angular8-datatable';
import { NgxLoadingModule } from 'ngx-loading';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    imports: [
      CommonModule,
    NgbModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    PageHeaderModule,
    SemesterRoutingModule,
    NgbTooltipModule,
    NgxLoadingModule,
    NgMultiSelectDropDownModule
    ],
    declarations: [
      SemesterComponent
      ]
})
export class SemesterModule {}
