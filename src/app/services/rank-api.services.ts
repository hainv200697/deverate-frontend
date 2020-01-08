import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class RankApiService {
    // URL = 'http://localhost:54318/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    getAllRank(isActive,companyId) {
        const param = new HttpParams().set('isActive', isActive).set('companyId',companyId);
        const API = 'RankApi/GetAllCompanyRank';
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }

    insertRank(listRankModel){
        const API = 'RankApi/updateOrCreateRankIfNotExist';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE + API, listRankModel);
    }

    updateRank(rankModel){
        const API = 'RankApi/UpdateCompanyRank';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, rankModel);
    }

    changeStatus(rankId, isActive){
        const API = 'RankApi/ChangeStatusCompanyRank?status=';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API + isActive , rankId);
    }

    getAllDefaultRank(){
        const API = 'RankApi/GetAllDefaultRank';
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_RESOURCE + API);
    }

}
