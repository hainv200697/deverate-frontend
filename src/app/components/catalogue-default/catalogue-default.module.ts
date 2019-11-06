import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogueDefaultComponent } from './catalogue-default.component';
import { PageHeaderModule } from '../../shared';
import {TooltipModule} from "ngx-tooltip";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CatalogueDefaultRoutingModule } from './catalogue-default-routing.module';
import { DataTableModule } from 'ng-angular8-datatable';
import { InsertQuestionModule } from '../question/ins-question/insert-question.module';
import { CatalogueDefaultFilterPipe } from './catalog-default-filter.pipe';
import { NgxLoadingModule } from 'ngx-loading';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    CatalogueDefaultRoutingModule,
    TranslateModule,
    InsertQuestionModule,    
    DataTableModule,
    ReactiveFormsModule,
    PageHeaderModule,
    TooltipModule,
    NgxLoadingModule.forRoot({})
  ],
  declarations: [
    CatalogueDefaultFilterPipe,
    CatalogueDefaultComponent
  ]
})
export class CatalogueDefaultModule { }