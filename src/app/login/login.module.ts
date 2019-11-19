import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        NgxLoadingModule,
        FormsModule],
    declarations: [LoginComponent]
})
export class LoginModule {}
