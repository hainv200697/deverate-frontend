import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class RankApiService {
    // URL = 'http://localhost:54318/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    getAllRank(isActive: boolean) {
        const API = 'RankApi/GetAllRank?isActive=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API + isActive);
    }

    insertRank(rankModel){
        const API = 'RankApi/CreateRank';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE + API, rankModel);
    }

    updateRank(rankModel){
        const API = 'RankApi/UpdateRank';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, rankModel);
    }

    changeStatus(rankId, isActive){
        const API = 'RankApi/ChangeStatusRank?status=';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API + isActive , rankId);
    }
}
