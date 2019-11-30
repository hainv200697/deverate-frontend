import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangepassComponent } from '../components/changepass/changepass.component';
import {BreadcrumbModule} from 'angular-crumbs';
import { RerankingModule } from '../components/ranking/reranking/reranking.module';
import { NgxLoadingModule } from 'ngx-loading';
@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        NgbDropdownModule,
        FormsModule,
        ReactiveFormsModule,
        BreadcrumbModule,
        RerankingModule,
        NgxLoadingModule,
    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        ProfileComponent,
        ChangepassComponent
    ]
})
export class LayoutModule {}
