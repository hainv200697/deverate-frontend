import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsertQuestionComponent } from './insert-question.component';
import { PageHeaderModule } from '../../../shared';
import { InsertQuestionRoutingModule } from './insert-question-routing.module';
import {TooltipModule} from "ngx-tooltip";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
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