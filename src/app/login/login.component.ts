import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthenticationService } from '../services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    username: string;
    password: string;
    constructor(
      private router: Router,
      private authenticationService: AuthenticationService
    ) {}

    ngOnInit() {
        if (sessionStorage.getItem('Authorization')) {
            this.router.navigate(['/catalogue']);
        }
    }

    onLogin() {
        const account = {
            username: this.username,
            password: this.password
        };
        this.authenticationService.login(account)
        .subscribe((res) => {
            if (res.status.code === 200) {
                sessionStorage.setItem('isLoggedin', 'true');
                sessionStorage.setItem('Authorization', res.data.data);
                sessionStorage.setItem('AccountId', '5');
                this.router.navigate(['/catalogue']);
            } else {
                alert(res.status.message);
            }
        });

    }
}
