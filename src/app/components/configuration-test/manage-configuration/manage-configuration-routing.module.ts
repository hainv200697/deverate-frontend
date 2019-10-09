import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageConfigurationComponent } from './manage-configuration.component';

const routes: Routes = [
    {
        path: '', component: ManageConfigurationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageConfigurationRoutingModule {
}
