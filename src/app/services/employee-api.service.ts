import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class EmployeeApiService {
    URL = 'https://localhost:5001/';
    // URL = AppSettings.BASEURL;
    constructor(
        private httpClient: HttpClient,
    ) { }

    getAllEmployee(questionId) {
        const API = 'api/Employee/GetEmployee';
        const param = new HttpParams().set('id', questionId);
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }

    postCreateEmployee(employee) {
        const API = 'api/Employee/CreateEmployee';
        return this.httpClient.post<any>(this.URL + AppSettings.ROUTE_TEST+ API, employee);
    }

    postCreateEmployeeByExcel(employees) {
        const API = 'api/Employee/CreateEmployeeExcel';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE + API, employees);
    }
}   
