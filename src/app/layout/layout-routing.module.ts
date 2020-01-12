import { RankDefaultModule } from './../components/rank_default/rank-default.module';
import { SemesterModule } from './../components/semester/semester.module';
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
            { path: 'manage-company-account', loadChildren: () => import('../components/employee-system/employee-system.module').then(m => m.EmployeeSystemModule), canActivate: [SystemGuard]},
            { path: 'manage-question-default/:id', loadChildren: () => import('../components/question-default/question-default.module').then(m => m.QuestionDefaultModule), canActivate: [SystemGuard]},
            { path: 'manage-answer-default/:id', loadChildren: () => import('../components/answer_default/answer-default.module').then(m => m.AnswerDefaultModule), canActivate: [SystemGuard]},
            { path: 'rank-default', loadChildren: () => import('../components/rank_default/rank-default.module').then(m => m.RankDefaultModule),canActivate: [SystemGuard]},

            // Company Manager
            { path: 'manage-employee', loadChildren: () => import('../components/employee/employee.module').then(m => m.EmployeeModule), canActivate: [CompanyGuard]},
            { path: 'catalogue', loadChildren: () => import('../components/catalogue/catalogue.module').then(m => m.CatalogueModule),canActivate: [CompanyGuard] },
            { path: 'manage-question/:id', loadChildren: () => import('../components/question/ins-question/insert-question.module').then(m => m.InsertQuestionModule),canActivate: [CompanyGuard] },
            { path: 'manage-answer/:id', loadChildren: () => import('../components/answer/answer.module').then(m => m.AnswerModule),canActivate: [CompanyGuard] },
            { path: 'stastistic-manager', loadChildren: () => import('../components/statistic-companymanager/statistic-companymanager.module').then(m => m.StatisticManagerModule),canActivate: [CompanyGuard]},
            { path: 'rank', loadChildren: () => import('../components/companyRank/rank.module').then(m => m.RankModule),canActivate: [CompanyGuard]},
            { path: 'statistic-company', loadChildren: () => import('../components/statistic/statistic.module').then(m => m.StatisticModule), canActivate: [CompanyGuard]},
            { path: 'statistic-company-applicant', loadChildren: () => import('../components/statistic-applicant-forTestOwner/statistic-applicant.module').then(m => m.StatisticApplicantModule), canActivate: [CompanyGuard]},

            // Test Owner
            { path: 'manage-configuration-applicant', loadChildren: () => import('../components/configuration-test/manage-configuration-applicant/manage-configuration-applicant.module').then(m => m.ManageConfigurationApplicantModule), canActivate: [OwnerGuard] },
            { path: 'manage-configuration', loadChildren: () => import('../components/configuration-test/manage-configuration/manage-configuration.module').then(m => m.ManageConfigurationModule), canActivate: [OwnerGuard] },
            { path: 'manage-test/:id', loadChildren: () => import('../components/view-test/view-test.module').then(m => m.TestModule), canActivate: [OwnerGuard] },
            { path: 'manage-detail-test/:id', loadChildren: () => import('../components/default-test/defaut-test.module').then(m => m.DefautTestModule), canActivate: [OwnerGuard] },
            { path: 'statistic', loadChildren: () => import('../components/statistic/statistic.module').then(m => m.StatisticModule), canActivate: [OwnerGuard]},
            { path: 'applicant', loadChildren: () => import('../components/applicant/applicant.module').then(m => m.ApplicantModule), canActivate: [OwnerGuard]},
            { path: 'sample-test', loadChildren: () => import('../components/sample-test/sample-test.module').then(m => m.SampleTestModule), canActivate: [OwnerGuard] },
            { path: 'statistic-applicant', loadChildren: () => import('../components/statistic-applicant-forTestOwner/statistic-applicant.module').then(m => m.StatisticApplicantModule), canActivate: [OwnerGuard]},
            { path: 'generate-test', loadChildren: () => import('../components/semester/semester.module').then(m => m.SemesterModule), canActivate: [OwnerGuard]},
            //Employee
            { path: 'reranking', component: RerankingComponent, canActivate: [EmployeeGuard]},
            { path: 'statistic-employee', loadChildren: () => import('../components/statistic-employee/statistic-employee.module').then(m => m.StatisticEmployeeModule), canActivate: [EmployeeGuard]},
            
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
