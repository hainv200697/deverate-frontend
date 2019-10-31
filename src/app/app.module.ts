import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { ToastrModule } from 'ngx-toastr';
import { TestModule } from './components/test/test.module';
import * as $ from 'jquery';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        LanguageTranslationModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TestModule,
        ToastrModule.forRoot()
    ],
    declarations: [
        AppComponent
    ],
    providers: [AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },],
    bootstrap: [AppComponent]
})
export class AppModule {}
