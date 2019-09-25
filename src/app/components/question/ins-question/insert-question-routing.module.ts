import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsertQuestionComponent } from './insert-question.component';

const routes: Routes = [
    {
        path: '', component: InsertQuestionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InsertQuestionRoutingModule {
}
