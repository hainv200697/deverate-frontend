import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticEmployeeComponent } from './statistic-employee.component';


const routes: Routes = [
    {
        path: '', component: StatisticEmployeeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StatisticEmployeeRoutingModule {
}
