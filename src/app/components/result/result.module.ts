import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResultComponent } from './result.component';

import { ResultRoutingModule } from './result-routing.module';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { GaugeModule } from 'angular-gauge';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxLoadingModule } from 'ngx-loading';
import { FusionChartsModule } from 'angular-fusioncharts';

// Load FusionCharts
import * as FusionCharts from 'fusioncharts';

// Load Widgets
import * as Widgets from 'fusioncharts/fusioncharts.widgets';

// Load FusionTheme Theme
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'

// Add dependencies to FusionChartsModule
FusionChartsModule.fcRoot(FusionCharts, Widgets, FusionTheme);

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
    NgxGaugeModule,
    GaugeModule.forRoot(),
    FusionChartsModule,
    NgxLoadingModule.forRoot({})
  ],
  
  declarations: [ResultComponent]
})
export class ResultModule { }