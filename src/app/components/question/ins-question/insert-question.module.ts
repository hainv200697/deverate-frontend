import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsertQuestionComponent } from './insert-question.component';
import { PageHeaderModule } from '../../../shared';
import { InsertQuestionRoutingModule } from './insert-question-routing.module';
import {TooltipModule} from "ngx-tooltip";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    InsertQuestionRoutingModule,
    PageHeaderModule,
    TooltipModule
  ],
  declarations: [InsertQuestionComponent]
})
export class InsertQuestionModule { }