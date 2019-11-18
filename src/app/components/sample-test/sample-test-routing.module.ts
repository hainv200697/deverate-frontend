import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SampleTestComponent } from './sample-test.component';

const routes: Routes = [
    {
        path: '', component: SampleTestComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SampleTestRoutingModule {
}
