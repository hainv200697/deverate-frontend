import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsertCompanyComponent } from './insert-company.component';

const routes: Routes = [
    {
        path: '', component: InsertCompanyComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InsertCompanyRoutingModule {
}
