import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    URL = 'http://deverate-env.2y3udamrqr.us-east-2.elasticbeanstalk.com/';
    constructor(private httpClient: HttpClient) { }

    public getAll() {
        const API = 'AccountAPI/GetAllAccount?pageSize=5&pageIndex=1';
        return this.httpClient.get(this.URL + API);
    }


}