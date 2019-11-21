import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangepassComponent } from '../components/changepass/changepass.component';
import { RerankingComponent } from '../components/ranking/reranking/reranking.component';
import { SystemGuard, CompanyGuard, OwnerGuard, EmployeeGuard } from '../shared';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            // System Manager
            { path: 'default-catalogue', loadChildren: () => import('../components/catalogue-default/catalogue-default.module').then(m => m.CatalogueDefaultModule), canActivate: [SystemGuard]},
            { path: 'manage-company', loadChildren: () => import('../components/company/ins-company/insert-company.module').then(m => m.InsertCompanyModule), canActivate: [SystemGuard]},
            
            // Company Manager
            { path: 'manage-employee', loadChildren: () => import('../components/employee/employee.module').then(m => m.EmployeeModule), canActivate: [CompanyGuard]},
            { path: 'catalogue', loadChildren: () => import('../components/catalogue/catalogue.module').then(m => m.CatalogueModule),canActivate: [CompanyGuard] },
            { path: 'manage-question/:id', loadChildren: () => import('../components/question/ins-question/insert-question.module').then(m => m.InsertQuestionModule),canActivate: [CompanyGuard] },
            { path: 'manage-answer/:id', loadChildren: () => import('../components/answer/answer.module').then(m => m.AnswerModule),canActivate: [CompanyGuard] },
            { path: 'stastistic-manager', loadChildren: () => import('../components/statistic-companymanager/statistic-companymanager.module').then(m => m.StatisticManagerModule),canActivate: [CompanyGuard]},
            // Test Owner
            { path: 'manage-configuration-applicant', loadChildren: () => import('../components/configuration-test/manage-configuration-applicant/manage-configuration-applicant.module').then(m => m.ManageConfigurationApplicantModule), canActivate: [OwnerGuard] },
            { path: 'manage-configuration', loadChildren: () => import('../components/configuration-test/manage-configuration/manage-configuration.module').then(m => m.ManageConfigurationModule), canActivate: [OwnerGuard] },
            { path: 'manage-test/:id', loadChildren: () => import('../components/view-test/view-test.module').then(m => m.TestModule), canActivate: [OwnerGuard] },
            { path: 'manage-detail-test/:id', loadChildren: () => import('../components/default-test/defaut-test.module').then(m => m.DefautTestModule), canActivate: [OwnerGuard] },
            { path: 'statistic', loadChildren: () => import('../components/statistic/statistic.module').then(m => m.StatisticModule), canActivate: [OwnerGuard]},
            { path: 'applicant', loadChildren: () => import('../components/applicant/applicant.module').then(m => m.ApplicantModule), canActivate: [OwnerGuard]},
            { path: 'sample-test', loadChildren: () => import('../components/sample-test/sample-test.module').then(m => m.SampleTestModule), canActivate: [OwnerGuard] },

            //Employee
            { path: 'reranking', component: RerankingComponent, canActivate: [EmployeeGuard]},

            
            { path: 'profile', component: ProfileComponent },
            { path: 'changepass', component: ChangepassComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
