import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionDefaultComponent } from './question-default.component';

const routes: Routes = [
    {
        path: '', component: QuestionDefaultComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuestionDefaultRoutingModule {
}
