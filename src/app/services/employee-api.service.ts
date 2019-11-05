import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class EmployeeApiService {
    // URL = 'http://localhost:9000/';
    URL = AppSettings.BASEURL;
    constructor(
        private httpClient: HttpClient,
    ) { }

    getAllEmployee(companyId,status) {
        const API = 'api/Employee/GetEmployee';
        const param = new HttpParams().set('companyId', companyId).set('status', status);
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }

    postCreateEmployee(employees) {
        const API = 'api/Employee/CreateEmployee';
        return this.httpClient.post<any>(this.URL + AppSettings.ROUTE_RESOURCE+ API, employees);
    }

    disableEmployee(employees){
        const API = 'api/Employee/RemoveEmployee';
        return this.httpClient.post<any>(this.URL + AppSettings.ROUTE_RESOURCE+ API, employees);
    }
}   
