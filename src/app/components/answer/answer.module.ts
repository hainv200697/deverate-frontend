import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnswerComponent } from './answer.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'ng-angular8-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderModule } from 'src/app/shared';
import { AnswerRoutingModule } from './answer-routing.module';
import { TooltipModule } from 'ngx-tooltip';
import { NgxLoadingModule } from 'ngx-loading';
import { AnswerFilterPipe } from './answer-filter.pipe';

@NgModule({
    imports: [
      CommonModule,
    NgbModule,
    FormsModule,
    DataTableModule,
    TranslateModule,
    ReactiveFormsModule,
    PageHeaderModule,
    AnswerRoutingModule,
    TooltipModule,
    NgxLoadingModule
    ],
    declarations: [
        AnswerComponent,AnswerFilterPipe
      ]
})
export class AnswerModule {}
