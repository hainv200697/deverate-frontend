import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticApplicantComponent } from './statistic-applicant.component';


const routes: Routes = [
    {
        path: '', component: StatisticApplicantComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StatisticApplicantRoutingModule {
}
