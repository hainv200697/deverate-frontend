import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestComponent } from './test.component';
import { NgxLoadingModule } from 'ngx-loading';
import { CountdownModule } from 'ngx-countdown';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    CountdownModule, 
    ReactiveFormsModule,
    NgxLoadingModule
  ],
  declarations: [TestComponent]
})
export class TestModule { }
