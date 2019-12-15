import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnswerDefaultComponent } from './answer-default.component';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'ng-angular8-datatable';
import { PageHeaderModule } from 'src/app/shared';
import { AnswerDefaultRoutingModule } from './answer-default-routing.module';
import { NgxLoadingModule } from 'ngx-loading';
import { AnswerDefaultFilterPipe } from './answer-default-filter.pipe';

@NgModule({
    imports: [
      CommonModule,
    NgbModule,
    FormsModule,
    DataTableModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    PageHeaderModule,
    AnswerDefaultRoutingModule,
    NgxLoadingModule
    ],
    declarations: [
        AnswerDefaultComponent,AnswerDefaultFilterPipe
      ]
})
export class AnswerDefaultModule {}
