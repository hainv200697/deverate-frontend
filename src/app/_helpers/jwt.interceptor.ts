import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (sessionStorage.getItem('Authorization')) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${sessionStorage.getItem('Authorization')}`
                }
            });
        }
        return next.handle(request);
    }
}