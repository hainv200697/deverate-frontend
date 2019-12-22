import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnswerDefaultComponent } from './answer-default.component';

const routes: Routes = [
    {
        path: '', component: AnswerDefaultComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnswerDefaultRoutingModule {
}
