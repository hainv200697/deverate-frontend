import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnswerComponent } from './answer.component';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'ng-angular8-datatable';
import { PageHeaderModule } from 'src/app/shared';
import { AnswerRoutingModule } from './answer-routing.module';
import { NgxLoadingModule } from 'ngx-loading';
import { AnswerFilterPipe } from './answer-filter.pipe';

@NgModule({
    imports: [
      CommonModule,
    NgbModule,
    FormsModule,
    DataTableModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    PageHeaderModule,
    AnswerRoutingModule,
    NgxLoadingModule
    ],
    declarations: [
        AnswerComponent,AnswerFilterPipe
      ]
})
export class AnswerModule {}
