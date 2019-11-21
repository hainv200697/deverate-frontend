import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class ApplicantApiService {
    // URL = 'http://localhost:9000/';
    URL = AppSettings.BASEURL;
    constructor(
        private httpClient: HttpClient,
    ) { }


    postCreateApplicant(applicants, configId) {
        const API = 'api/Applicant/CreateApplicant?configId=';
        return this.httpClient.post<any>(this.URL + AppSettings.ROUTE_RESOURCE + API + configId, applicants);
    }


}   
