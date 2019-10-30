import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class StatisticApiService {
    // URL = 'http://localhost:8080/';
    URL = AppSettings.BASEURL;

    constructor(private httpClient: HttpClient) { }

    getHistory(accId){
        const API = 'api/System/History/';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_TEST + API + accId);
        // return this.httpClient.get(this.URL + API + accId);
    }

    getStatistic(id) {
        const API = 'api/System/Statistic/';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_TEST + API + id);
        // return this.httpClient.get(this.URL + API + id);
    }

}