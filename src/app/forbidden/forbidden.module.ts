import { ForbiddenComponent } from './forbidden.component';
import { ForbiddenRoutingModule } from './forbidden-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    ForbiddenRoutingModule
  ],
  declarations: [ForbiddenComponent]
})
export class ForbiddenModule { }
