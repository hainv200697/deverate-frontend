import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RankDefaultComponent } from './rank-default.component';

const routes: Routes = [
    {
        path: '', component: RankDefaultComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RankDefaultRoutingModule {
}
