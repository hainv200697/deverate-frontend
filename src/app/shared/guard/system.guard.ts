import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class SystemGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        if (localStorage.getItem('Role') === 'System Manager') {
            return true;
        }

        this.router.navigate(['/forbidden']);
        return false;
    }
}
