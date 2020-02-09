import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
    { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
    { path: 'sample-test', loadChildren: () => import('./components/sample-test/sample-test.module').then(m => m.SampleTestModule) },
    { path: 'test/:testId', component: TestComponent},
    { path: 'result/:testId', loadChildren: () => import('./components/result/result.module').then(m => m.ResultModule)},
    { path: 'signup', loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule) },
    { path: 'forgotpass', loadChildren: () => import('./components/forgotpass/forgotpass.module').then(m => m.ForgotpassModule) },
    { path: 'error', loadChildren: () => import('./server-error/server-error.module').then(m => m.ServerErrorModule) },
    { path: 'not-found', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: 'forbidden', loadChildren: () => import('./forbidden/forbidden.module').then(m => m.ForbiddenModule) },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
