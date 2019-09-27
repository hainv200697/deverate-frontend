import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangepassComponent } from './changepass.component';

const routes: Routes = [
    {
        path: '', component: ChangepassComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChangepassRoutingModule {
}
