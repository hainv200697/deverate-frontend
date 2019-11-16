import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogueDefaultComponent } from './catalogue-default.component';
import { PageHeaderModule } from '../../shared';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
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
    InsertQuestionModule,    
    DataTableModule,
    ReactiveFormsModule,
    PageHeaderModule,
    NgxLoadingModule.forRoot({}),
    NgbTooltipModule
  ],
  declarations: [
    CatalogueDefaultFilterPipe,
    CatalogueDefaultComponent
  ]
})
export class CatalogueDefaultModule { }