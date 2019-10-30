import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthenticationService } from '../services/authentication.service';
import * as jwt_decode from 'jwt-decode';

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
    ) { }

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
                    const userInfo = this.getDecodedAccessToken(res.data.data);
                    if (userInfo != null) {
                        sessionStorage.setItem('isLoggedin', 'true');
                        sessionStorage.setItem('Authorization', res.data.data);
                        sessionStorage.setItem('Username', userInfo.Username);
                        sessionStorage.setItem('AccountId', userInfo.AccountId);
                        sessionStorage.setItem('Fullname', userInfo.Fullname);
                        this.router.navigate(['/catalogue']);
                    }
                } else {
                    alert(res.status.message);
                }
            });
    }

    getDecodedAccessToken(token: string): any {
        try {
            const userInfo = jwt_decode(token);
            console.log(userInfo);
            return userInfo;
        } catch (Error) {
            return null;
        }
    }
}
