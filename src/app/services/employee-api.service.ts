import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class EmployeeApiService {
    URL = 'http://localhost:9000/';
    // URL = AppSettings.BASEURL;
    constructor(
        private httpClient: HttpClient,
    ) { }

    getAllEmployee(companyId,status) {
        const API = 'api/Employee/GetEmployee';
        const param = new HttpParams().set('companyId', companyId).set('status', status);
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }

    postCreateEmployee(employees) {
        const API = 'api/Employee/CreateEmployee';
        return this.httpClient.post<any>(this.URL + AppSettings.ROUTE_AUTH+ API, employees);
    }

    disableEmployee(employees,status){
        const API = 'api/Employee/UpdateEmployeeStatus';
        const param = new HttpParams().set('status', status);
        return this.httpClient.put<any>(this.URL + AppSettings.ROUTE_RESOURCE+ API, employees,{ params: param });
    }

    resendpassword(employees, companyId){
        const API = 'api/Employee/ResendPassword';
        const param = new HttpParams().set('companyId',companyId);
        return this.httpClient.post<any>(this.URL + AppSettings.ROUTE_RESOURCE+ API, employees,{ params: param });
    }

    putUpdateAccount(employee) {
        const API = 'api/Employee/UpdateAccountRole';
        return this.httpClient.put<any>(this.URL + AppSettings.ROUTE_RESOURCE+ API, employee);
    }
    getAllWithRole(companyId,status,role) {
        const API = 'api/Employee/GetAccountByRole';
        const param = new HttpParams().set('companyId', companyId).set('status', status).set('role', role);
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }
}   
