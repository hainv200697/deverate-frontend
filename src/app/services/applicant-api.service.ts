import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class ApplicantApiService {
    // URL = 'http://localhost:5000/';
    URL = AppSettings.BASEURL;
    constructor(
        private httpClient: HttpClient,
    ) { }

    postCreateApplicant(applicants, configId,startDate,endDate) {
        let start =  new Date(startDate).toISOString();
        let end = new Date(endDate).toISOString();
        const API = 'api/Applicant/CreateApplicant?configId='+configId+'&startDate='+start+'&endDate='+end;
        return this.httpClient.post<any>(this.URL + AppSettings.ROUTE_RESOURCE + API, applicants);
    }


}   
