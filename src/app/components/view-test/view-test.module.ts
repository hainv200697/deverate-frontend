import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewTestComponent } from './view-test.component';
import { NgxLoadingModule } from 'ngx-loading';
import { TooltipModule } from 'ngx-tooltip';
import { DataTableModule } from 'ng-angular8-datatable';
import { ViewTestRoutingModule } from './view-test-routing.module';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    TranslateModule,
    ViewTestRoutingModule,
    TooltipModule,
    ReactiveFormsModule,
    NgxLoadingModule,
    DataTableModule
  ],
  declarations: [ViewTestComponent]
})
export class TestModule { }
