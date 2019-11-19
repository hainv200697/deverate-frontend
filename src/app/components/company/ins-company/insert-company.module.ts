import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsertCompanyComponent } from './insert-company.component';
import { PageHeaderModule } from '../../../shared';
import { InsertCompanyRoutingModule } from './insert-company-routing.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DataTableModule } from 'ng-angular8-datatable';
import { CompanyFilterPipe } from './company-filter.pipe';
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    InsertCompanyRoutingModule,
    PageHeaderModule,
    SweetAlert2Module.forRoot(),
    SweetAlert2Module,
    SweetAlert2Module.forChild({}),
    DataTableModule,
    ToastrModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    NgbTooltipModule
  ],
  
  declarations: [InsertCompanyComponent,CompanyFilterPipe]
})
export class InsertCompanyModule { }