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
                const userInfo = this.getDecodedAccessToken(res.token);
                if (userInfo != null) {
                    sessionStorage.setItem('isLoggedin', 'true');
                    sessionStorage.setItem('Authorization', res.token);
                    sessionStorage.setItem('Username', userInfo.username);
                    sessionStorage.setItem('AccountId', userInfo.accountId);
                    sessionStorage.setItem('Fullname', userInfo.fullname);
                    sessionStorage.setItem('CompanyId', userInfo.companyId);
                    sessionStorage.setItem('Role', userInfo.role);
                    switch (userInfo.role) {
                        case 'System Manager':
                            this.router.navigate(['/manage-company']);
                            break;
                        case 'Company Manager':
                            this.router.navigate(['/manage-employee']);
                            break;
                        case 'Test Owner':
                             this.router.navigate(['/manage-configuration']);
                            break;
                        case 'Employee':
                             this.router.navigate(['/reranking']);
                            break;
                        default:
                             this.router.navigate(['/forbidden']);
                    }
                }
            }, (error) => {
                alert(error);
            });
    }

    getDecodedAccessToken(token: string): any {
        try {
            const userInfo = jwt_decode(token);
            return userInfo;
        } catch (Error) {
            return null;
        }
    }
}
