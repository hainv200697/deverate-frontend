import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionDefaultComponent } from './question-default.component';
import { PageHeaderModule } from '../../shared';
import { QuestionDefaultRoutingModule } from './question-default-routing.module';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from 'ng-angular8-datatable';
import {QuestionDefaultFilterPipe} from './question-default-filter.pipe';
import { NgxLoadingModule } from 'ngx-loading';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    DataTableModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    QuestionDefaultRoutingModule,
    PageHeaderModule,
    NgxLoadingModule,
  ],
  declarations: [QuestionDefaultComponent,QuestionDefaultFilterPipe]
})
export class QuestionDefaultModule { }