import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticManagerComponent } from './statistic-companymanager.component';


const routes: Routes = [
    {
        path: '', component: StatisticManagerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StatisticManagerRoutingModule {
}
