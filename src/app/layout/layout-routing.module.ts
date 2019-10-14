import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangepassComponent } from '../components/changepass/changepass.component';
import { RerankingComponent } from '../components/ranking/reranking/reranking.component';
// import { InsertQuestionComponent } from '../components/question/ins-question/insert-question.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            //{ path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),data: { breadcrumb: 'Home' } },
            { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)},
            { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
            { path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
            { path: 'bs-element', loadChildren: () => import('./bs-element/bs-element.module').then(m => m.BsElementModule) },
            { path: 'grid', loadChildren: () => import('./grid/grid.module').then(m => m.GridModule) },
            { path: 'components', loadChildren: () => import('./bs-component/bs-component.module').then(m => m.BsComponentModule) },
            { path: 'blank-page', loadChildren: () => import('./blank-page/blank-page.module').then(m => m.BlankPageModule) },
            { path: 'profile', component: ProfileComponent },
            { path: 'changepass', component: ChangepassComponent },
            { path: 'catalogue', loadChildren: () => import('../components/catalogue/catalogue.module').then(m => m.CatalogueModule)},
            { path: 'manage-question/:id', loadChildren: () => import('../components/question/ins-question/insert-question.module').then(m => m.InsertQuestionModule) },
            { path: 'manage-company', loadChildren: () => import('../components/company/ins-company/insert-company.module').then(m => m.InsertCompanyModule) },
            { path: 'manage-configuration', loadChildren: () => import('../components/configuration-test/manage-configuration/manage-configuration.module').then(m => m.ManageConfigurationModule)},
            { path: 'reranking', loadChildren: () => import('../components/ranking/reranking/reranking.module').then(m => m.RerankingModule) },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
