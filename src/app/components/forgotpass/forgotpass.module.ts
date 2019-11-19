import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotpassRoutingModule } from './forgotpass-routing.module';
import { ForgotpassComponent } from './forgotpass.component';

@NgModule({
  imports: [
    CommonModule,
    ForgotpassRoutingModule
  ],
  declarations: [ForgotpassComponent]
})
export class ForgotpassModule { }
