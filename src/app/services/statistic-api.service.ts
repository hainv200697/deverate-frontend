import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class StatisticApiService {
    URL = 'http://localhost:8080/';
    routes = '';

    constructor(private httpClient: HttpClient) { }

    getStatistic(id: number) {
        const API = 'api/System/Statistic/';
        return this.httpClient.get(this.URL + this.routes + API + id);
    }

}