import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnswerComponent } from './answer.component';

const routes: Routes = [
    {
        path: '', component: AnswerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnswerRoutingModule {
}
