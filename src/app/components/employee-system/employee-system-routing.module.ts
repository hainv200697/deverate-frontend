import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeSystemComponent } from './employee-system.component';

const routes: Routes = [
    {
        path: '', component: EmployeeSystemComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeSystemRoutingModule {
}
