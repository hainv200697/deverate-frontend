import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_TEST + API + accId);
    }

    getStatistic(id) {
        const API = 'api/System/Statistic/';
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_TEST + API + id);
    }

    GetGeneralStatistic(id) {
        const API = 'api/Test/GetGeneralStatistic?accountId=';
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_TEST + API + id);
    }

    GetGeneralStatisticOfApplicant(id) {
        const API = 'api/Test/GetGeneralStatisticOfApplicant?accountId=';
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_TEST + API + id);
    }

    GetRankStatistic(id) {
        const API = 'api/Test/GetRankStatistic?accountId=';
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_TEST + API + id);
    }

    GetRankStatisticOfApplicant(id) {
        const API = 'api/Test/GetRankStatisticOfApplicant?accountId=';
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_TEST + API + id);
    }

    GetOverallPointStatistic(companyid, configId, isEmployee) {
        const API = 'api/Test/GetOverallPointStatistic';
        const params = new HttpParams().set('companyId', companyid).set('configId', configId).set('isEmployee', isEmployee);
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_TEST + API, {params});
    }

    GetAccountByTestId(testId) {
        const API = 'api/Test/GetInfoByTestId?testId=';
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_TEST + API + testId);
    }
}