import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangepassRoutingModule } from './changepass-routing.module';
import { ChangepassComponent } from './changepass.component';

@NgModule({
  imports: [
    CommonModule,
    ChangepassRoutingModule
  ],
  declarations: [ChangepassComponent]
})
export class ChangepassModule { }
