import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class SemesterApiService {
    // URL = 'http://localhost:9000/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    createTest(testModel){
        const API = 'api/System/Gen';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_TEST + API, testModel);
    }
}