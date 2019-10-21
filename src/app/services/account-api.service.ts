import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class AccountApiService {
    // URL = 'http://localhost:58810/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    getManagerByCompanyId(id: number) {
        const API = 'AccountAPI/GetAccountByCompanyId?id=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API + id);
    }

    updateManagerInfo(ManagerModel) {
        const API = 'AccountAPI/UpdateAccount';
        return new Promise(resolve => {
            this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, ManagerModel).subscribe(data => {
                resolve(data);
            });
        });
    }

}
