import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss']
})
export class BlankPageComponent implements OnInit {
    account = [];
    constructor(
        private apiService: ApiService
    ) { }
    title = 'aaaaaa';
    ngOnInit() {
        this.apiService.getAll().subscribe(
            (data) => {

                this.account = data['data']['data'];
                console.log(JSON.stringify(this.account));
            }
        );
    }
}
