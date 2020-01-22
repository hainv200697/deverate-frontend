import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class ApproveApiService {
    URL = AppSettings.BASEURL;
    constructor(
        private httpClient: HttpClient,
    ) { }

    getAllApproveRequest(configId) {
        const API = 'api/approve/getapproverequest/';
        const param = new HttpParams().set('configId', configId);
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }

    approveRank(configId,accountId,isApprove){
        const API = 'api/approve/approveorrejectrank/';
        const param = new HttpParams().set('configId', configId).set('accountId', accountId).set('isApprove', isApprove);
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }
}