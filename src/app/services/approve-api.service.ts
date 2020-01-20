import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class ApproveApiService {
    URL = 'http://localhost:5000/';
    // URL = AppSettings.BASEURL;
    constructor(
        private httpClient: HttpClient,
    ) { }

    getAllApproveRequest(configId) {
        const API = '';
        const param = new HttpParams().set('configId', configId);
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }
}