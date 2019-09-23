import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-changepass',
    templateUrl: './changepass.component.html',
    styleUrls: ['./changepass.component.scss'],
    animations: [routerTransition()]
})
export class ChangepassComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
