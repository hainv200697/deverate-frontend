import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { ToastrService } from 'ngx-toastr';
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
    public loading = false;
    constructor(
        private router: Router,
        private toast : ToastrService,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        if (localStorage.getItem('Authorization')) {
            const role = localStorage.getItem('Role');
            switch (role) {
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
    }

    onLogin() {
        this.loading = true;
        const account = {
            username: this.username,
            password: this.password
        };
        this.authenticationService.login(account)
            .subscribe((res) => {
                const userInfo = this.getDecodedAccessToken(res.token);
                if (userInfo != null) {
                    localStorage.setItem('isLoggedin', 'true');
                    localStorage.setItem('Authorization', res.token);
                    localStorage.setItem('Username', userInfo.username);
                    localStorage.setItem('AccountId', userInfo.accountId);
                    localStorage.setItem('Fullname', userInfo.fullname);
                    localStorage.setItem('CompanyId', userInfo.companyId);
                    const role = userInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                    localStorage.setItem('Role', role);
                    switch (role) {
                        case 'System Manager':
                            this.router.navigate(['/manage-company']);
                            break;
                        case 'Company Manager':
                            this.router.navigate(['/manage-employee']);
                            break;
                        case 'Test Owner':
                             this.router.navigate(['/semester']);
                            break;
                        case 'Employee':
                             this.router.navigate(['/reranking']);
                            break;
                        default:
                             this.router.navigate(['/forbidden']);
                    }
                }
                this.loading = false
            }, (error) => {
                this.toast.error('Username or password invalid');
                this.loading = false
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
