import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class CompanyApiService {
    URL = 'http://localhost:58810/';
    constructor(private httpClient: HttpClient) { }
    
    getAllCompany(isActive: boolean) {
        const API = 'CompanyAPI/GetAllCompany?isActive=';
        return this.httpClient.get(this.URL + API + isActive );
    }

    getCompanyById(id: number) {
        const API = 'CompanyAPI/GetCompanyById?id=';
        return this.httpClient.get(this.URL + API + id );
    }

    getCompanyByName(name: string) {
        const API = 'CompanyAPI/GetCompanyByName?name=';
        return this.httpClient.get(this.URL + API + name );
    }
    
    insertCompany(CompanyModel) {
        const API = 'CompanyAPI/CreateCompany';
        return new Promise(resolve => {
            this.httpClient.post(this.URL + API, CompanyModel).subscribe(data => {
              resolve(data);
            })
        });
    }

    updateCompany(CompanyModel){
        const API = 'CompanyAPI/UpdateCompany';
        return new Promise(resolve => {
            this.httpClient.put(this.URL + API, CompanyModel).subscribe(data => {
              resolve(data);
            })
        });
    }
    disableCompany(CompanyModel){
        const API = 'CompanyAPI/DisableCompany';
        return new Promise(resolve => {
            this.httpClient.put(this.URL + API, CompanyModel).subscribe(data => {
              resolve(data);
            })
        });
    }
}