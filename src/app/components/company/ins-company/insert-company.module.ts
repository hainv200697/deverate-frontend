import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsertCompanyComponent } from './insert-company.component';
import { PageHeaderModule } from '../../../shared';
import { InsertCompanyRoutingModule } from './insert-company-routing.module';
import {TooltipModule} from "ngx-tooltip";
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    InsertCompanyRoutingModule,
    PageHeaderModule,
    TooltipModule

  ],
  declarations: [InsertCompanyComponent]
})
export class InsertCompanyModule { }