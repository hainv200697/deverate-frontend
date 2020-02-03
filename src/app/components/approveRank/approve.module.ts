import { ApproveFilterPipe } from './approve-filter.pipe';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApproveComponent } from './approve.component';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'ng-angular8-datatable';
import { PageHeaderModule } from 'src/app/shared';
import { ApproveRoutingModule } from './approve-routing.module';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
    imports: [
      CommonModule,
      NgbModule,
      FormsModule,
      DataTableModule,
      NgbTooltipModule,
      ReactiveFormsModule,
      PageHeaderModule,
      ApproveRoutingModule,
      NgxLoadingModule
    ],
    declarations: [ApproveComponent,ApproveFilterPipe]
})
export class ApproveModule {}