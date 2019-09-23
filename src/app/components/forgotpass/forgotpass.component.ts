import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-forgotpass',
    templateUrl: './forgotpass.component.html',
    styleUrls: ['./forgotpass.component.scss'],
    animations: [routerTransition()]
})
export class ForgotpassComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
