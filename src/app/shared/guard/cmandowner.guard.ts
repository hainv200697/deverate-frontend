import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class CMAndOwnerGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        if (localStorage.getItem('Role') === 'Test Owner' || localStorage.getItem('Role') === 'Company Manager') {
            return true;
        }

        this.router.navigate(['/forbidden']);
        return false;
    }
}
