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
        if (localStorage.getItem('Authorization')) {
            this.router.navigate(["/dashboard"]);
        }
    }

    onLogin() {
        var account = {
            username: this.username,
            password: this.password
        }
        this.authenticationService.login(account)
        .subscribe((res) => {
            if (res.status.code == 200) {
                localStorage.setItem('isLoggedin', 'true');
                localStorage.setItem('Authorization', res.data.data);
                this.router.navigate(["/dashboard"]);
            } else {
                alert(res.status.message);
            } 
        })
        
    }
}
