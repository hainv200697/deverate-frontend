import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class AccountApiService {
    URL = 'http://localhost:58810/';
    constructor(private httpClient: HttpClient) { }

    getManagerByCompanyId(id: number) {
        const API = 'AccountAPI/GetAccountByCompanyId?id=';
        return this.httpClient.get(this.URL + API + id );
    }

    updateManagerInfo(ManagerModel){
        const API = 'AccountAPI/UpdateAccount';
        return new Promise(resolve => {
            this.httpClient.put(this.URL + API, ManagerModel).subscribe(data => {
              resolve(data);
            })
        });
    }
    
}