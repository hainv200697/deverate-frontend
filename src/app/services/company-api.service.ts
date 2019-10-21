import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class CompanyApiService {
    // URL = 'http://localhost:54318/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    getAllCompany(isActive: boolean) {
        const API = 'CompanyAPI/GetAllCompany?isActive=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API + isActive);
    }

    getCompanyById(id: number) {
        const API = 'CompanyAPI/GetCompanyById?id=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API + id);
    }

    getCompanyByName(name: string) {
        const API = 'CompanyAPI/GetCompanyByName?name=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API + name);
    }

    insertCompany(CompanyModel) {
        const API = 'CompanyAPI/CreateCompany';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE+ API, CompanyModel);
    }

    updateCompany(CompanyModel) {
        const API = 'CompanyAPI/UpdateCompany';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, CompanyModel);
    }

    disableCompany(CompanyModel) {
        const API = 'CompanyAPI/DisableCompany';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, CompanyModel);
    }
}
