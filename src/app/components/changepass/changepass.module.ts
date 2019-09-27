import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ChangepassRoutingModule } from './changepass-routing.module';
import { ChangepassComponent } from './changepass.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ChangepassRoutingModule
  ],
  declarations: [ChangepassComponent]
})
export class ChangepassModule { }
