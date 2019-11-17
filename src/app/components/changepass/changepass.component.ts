import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-changepass',
    templateUrl: './changepass.component.html',
    styleUrls: ['./changepass.component.scss'],
    animations: [routerTransition()]
})
export class ChangepassComponent implements OnInit {
    constructor(private authenticationService: AuthenticationService) {}
    oldPassword = '';
    newPassword = '';
    rePassword = ''

    ngOnInit() {}

    changePassword(){
        if (this.newPassword != this.rePassword) {
            return;
        }
        const user = {
            username: localStorage.getItem('Username'),
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
        }
        this.authenticationService.changePassword(user)
        .subscribe((res) => {
            alert("success")
        }, (error) => {
            if (error.status == 400) {
                alert("Current password is invalid")
            }
        })
    }
}
