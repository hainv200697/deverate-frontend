import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogueComponent } from './catalogue.component';
import { PageHeaderModule } from '../../shared';
import {TooltipModule} from "ngx-tooltip";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { DataTableModule } from 'ng-angular8-datatable';
import { InsertQuestionModule } from '../question/ins-question/insert-question.module';
import { CatalogueFilterPipe } from './catalog-filter.pipe';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    CatalogueRoutingModule,
    TranslateModule,
    InsertQuestionModule,    
    DataTableModule,
    ReactiveFormsModule,
    PageHeaderModule,
    TooltipModule
  ],
  declarations: [
    CatalogueFilterPipe,
    CatalogueComponent
  ]
})
export class CatalogueModule { }