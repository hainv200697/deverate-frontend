import { ManageConfigurationApplicantComponent } from './manage-configuration-applicant.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
    {
        path: '', component: ManageConfigurationApplicantComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageConfigurationApplicantRoutingModule {
}
