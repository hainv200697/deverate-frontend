import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogueComponent } from './catalogue.component';
import { PageHeaderModule } from '../../shared';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { DataTableModule } from 'ng-angular8-datatable';
import { InsertQuestionModule } from '../question/ins-question/insert-question.module';
import { CatalogueFilterPipe } from './catalog-filter.pipe';
import { NgxLoadingModule } from 'ngx-loading';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    CatalogueRoutingModule,
    InsertQuestionModule,    
    DataTableModule,
    ReactiveFormsModule,
    PageHeaderModule,
    NgbTooltipModule,
    NgxLoadingModule.forRoot({})
  ],
  declarations: [
    CatalogueFilterPipe,
    CatalogueComponent
  ]
})
export class CatalogueModule { }