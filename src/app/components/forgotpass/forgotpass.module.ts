import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ForgotpassRoutingModule } from './forgotpass-routing.module';
import { ForgotpassComponent } from './forgotpass.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ForgotpassRoutingModule
  ],
  declarations: [ForgotpassComponent]
})
export class ForgotpassModule { }
