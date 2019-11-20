import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-changepass',
    templateUrl: './changepass.component.html',
    styleUrls: ['./changepass.component.scss'],
    animations: [routerTransition()]
})
export class ChangepassComponent implements OnInit {
    constructor
        (
            private authenticationService: AuthenticationService,
            private toast: ToastrService,
    ) { }
    oldPassword;
    newPassword;
    rePassword;

    ngOnInit() {
        this.clearData();
     }

    clearData() {
        this.oldPassword = '';
        this.newPassword = '';
        this.rePassword = ''
    }

    changePassword() {
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
                this.toast.success("Success");
                this.clearData();
            }, (error) => {
                if (error.status == 400) {
                    this.toast.error("Current password is invalid");
                }
            })
    }
}
