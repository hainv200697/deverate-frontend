import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogueDefaultComponent } from './catalogue-default.component';

const routes: Routes = [
    {
        path: '', component: CatalogueDefaultComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogueDefaultRoutingModule {
}
