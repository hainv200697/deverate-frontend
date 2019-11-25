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

    getHistory(accId) {
        const API = 'api/System/History/';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_TEST + API + accId);
    }

    getStatistic(id) {
        const API = 'api/System/Statistic/';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_TEST + API + id);
    }

    GetGeneralStatistic(id) {
        const API = 'api/Test/GetGeneralStatistic?accountId=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_TEST + API + id);
    }

    GetGeneralStatisticOfApplicant(id) {
        const API = 'api/Test/GetGeneralStatisticOfApplicant?accountId=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_TEST + API + id);
    }

    GetRankStatistic(id) {
        const API = 'api/Test/GetRankStatistic?accountId=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_TEST + API + id);
    }

    GetRankStatisticOfApplicant(id) {
        const API = 'api/Test/GetRankStatisticOfApplicant?accountId=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_TEST + API + id);
    }

    GetOverallPointStatistic(id, isEmployee) {
        const API = 'api/Test/GetOverallPointStatistic?companyId=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_TEST + API + id + '&isEmployee=' + isEmployee);
    }

    GetAccountByTestId(testId) {
        const API = 'api/Test/GetInfoByTestId?testId=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_TEST + API + testId);
    }
}