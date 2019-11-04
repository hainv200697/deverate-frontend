import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsertQuestionComponent } from './insert-question.component';
import { PageHeaderModule } from '../../../shared';
import { InsertQuestionRoutingModule } from './insert-question-routing.module';
import {TooltipModule} from "ngx-tooltip";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from 'ng-angular8-datatable';
import {InsertQuestionFilterPipe} from './insert-question-filter.pipe';
import { NgxLoadingModule } from 'ngx-loading';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    DataTableModule,
    TranslateModule,
    ReactiveFormsModule,
    InsertQuestionRoutingModule,
    PageHeaderModule,
    NgxLoadingModule,
    TooltipModule
  ],
  declarations: [InsertQuestionComponent,InsertQuestionFilterPipe]
})
export class InsertQuestionModule { }