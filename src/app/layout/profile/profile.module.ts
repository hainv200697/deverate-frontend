import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from './../../shared';
import { ProfileComponent } from '../profile/profile.component';
import { FormsModule  } from "@angular/forms";     
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
    imports: [
        CommonModule, 
        NgbModule,
        PageHeaderModule,
        FormsModule,
        NgxLoadingModule.forRoot({})
    ],
    declarations: [ProfileComponent,]
})
export class ProfileModule {}