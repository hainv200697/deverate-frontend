import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeSystemComponent } from './employee-system.component';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'ng-angular8-datatable';
import { PageHeaderModule } from 'src/app/shared';
import { EmployeeSystemRoutingModule } from './employee-system-routing.module';
import { NgxLoadingModule } from 'ngx-loading';
import { EmployeeSystemFilterPipe } from './employee-system-filter.pipe';

@NgModule({
    imports: [
      CommonModule,
    NgbModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    PageHeaderModule,
    EmployeeSystemRoutingModule,
    NgbTooltipModule,
    NgxLoadingModule
    ],
    declarations: [
      EmployeeSystemComponent,
      EmployeeSystemFilterPipe
      ]
})
export class EmployeeSystemModule {}
