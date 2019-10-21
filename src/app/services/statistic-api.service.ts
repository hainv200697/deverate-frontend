import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class StatisticApiService {
    // URL = 'https://localhost:5001/';
    URL = AppSettings.BASEURL;

    constructor(private httpClient: HttpClient) { }

    getStatistic(id: number) {
        const API = 'api/System/Statistic/';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_TEST + API + id);
    }

}