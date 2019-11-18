import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SampleTestRoutingModule } from './sample-test-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SampleTestComponent } from './sample-test.component';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    SampleTestRoutingModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [SampleTestComponent]
})
export class SampleTestModule { }
