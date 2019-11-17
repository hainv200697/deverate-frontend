import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class EmployeeGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        if (localStorage.getItem('Role') === 'Employee') {
            return true;
        }

        this.router.navigate(['/forbidden']);
        return false;
    }
}
