import { NgxLoadingModule } from 'ngx-loading';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from './../../shared';
import { ProfileComponent } from '../profile/profile.component';
import { FormsModule  } from "@angular/forms";     

@NgModule({
    imports: [
        CommonModule, 
        NgbModule,
        PageHeaderModule,
        FormsModule,
        NgxLoadingModule,
    ],
    declarations: [ProfileComponent,]
})
export class ProfileModule {}