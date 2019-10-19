import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import {TooltipModule} from 'ngx-tooltip';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DataTableModule } from 'ng-angular8-datatable';
import { ToastrModule } from 'ngx-toastr';
import { RerankingComponent } from './reranking.component';
import { RerankingRoutingModule } from './reranking-routing.module';
import { TestComponent } from './test/test.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    RerankingRoutingModule,
    PageHeaderModule,
    TooltipModule,
    SweetAlert2Module.forRoot(),
    SweetAlert2Module,
    SweetAlert2Module.forChild({}),
    DataTableModule,
    ToastrModule.forRoot()
  ],
  declarations: [RerankingComponent,TestComponent]
})
export class RerankingModule {}
