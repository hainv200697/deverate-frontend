import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefautTestComponent } from './defaut-test.component';

const routes: Routes = [
    {
        path: '', component: DefautTestComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DefautTestRoutingModule {
}
