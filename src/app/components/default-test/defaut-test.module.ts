import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DefautTestRoutingModule } from './defaut-test-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefautTestComponent } from './defaut-test.component';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    DefautTestRoutingModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [DefautTestComponent]
})
export class DefautTestModule { }
