import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'ng-angular8-datatable';
import { PageHeaderModule } from 'src/app/shared';
import { EmployeeRoutingModule } from './employee-routing.module';
import { NgxLoadingModule } from 'ngx-loading';
import { EmployeeFilterPipe } from './employee-filter.pipe';

@NgModule({
    imports: [
      CommonModule,
    NgbModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    PageHeaderModule,
    EmployeeRoutingModule,
    NgbTooltipModule,
    NgxLoadingModule
    ],
    declarations: [
      EmployeeComponent,
      EmployeeFilterPipe
      ]
})
export class EmployeeModule {}
