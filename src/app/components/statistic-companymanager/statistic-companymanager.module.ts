import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatisticManagerComponent } from './statistic-companymanager.component';
import { StatisticManagerRoutingModule } from './statistic-companymanager-routing.module';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    StatisticManagerRoutingModule,
  ],
  
  declarations: [StatisticManagerComponent]
})
export class StatisticManagerModule { }