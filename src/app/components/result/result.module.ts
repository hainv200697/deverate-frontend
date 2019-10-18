import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResultComponent } from './result.component';

import { ResultRoutingModule } from './result-routing.module';

import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { GaugeModule } from 'angular-gauge';
import 'd3';
import 'nvd3';



@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    ResultRoutingModule,
    Ng2Charts,
    GaugeModule.forRoot()
  ],
  
  declarations: [ResultComponent]
})
export class ResultModule { }