import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RerankingComponent } from './reranking.component';

const routes: Routes = [
    {
        path: '', component: RerankingComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RerankingRoutingModule {
}
