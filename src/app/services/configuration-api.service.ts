import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class ConfigurationApiService {
    // URL = 'http://localhost:9000/';
    URL = AppSettings.BASEURL;   
    constructor(private httpClient: HttpClient) { }

    getAllConfiguration(status, id) {
        const API = 'ConfigurationAPI/GetAllConfiguration?type=';
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_RESOURCE+ API + status + '&companyId=' +id);
    }

    GetConfigurationCatalogueByConfigId(id) {
        const API = 'ConfigurationApi/GetConfigurationById?id=';
        return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_RESOURCE+ API + id);
    }

    createConfigurartion(ConfigurationModel) {
        const API = 'ConfigurationApi/CreateConfiguration';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE + API, ConfigurationModel);

    }

    updateConfiguration(ConfigurationModel) {
        const API = 'ConfigurationApi/UpdateConfiguration';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, ConfigurationModel);
    }

    changeStatusConfiguration(lstConfigId, isActive) {
        const API = 'ConfigurationApi/ChangeStatusConfiguration?isActive=';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API + isActive , lstConfigId);
    }

    sendMail(id){
        const API = 'api/System/SendTestMail/';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_TEST + API + id);
    }

    getConfigForEmployee(companyId){
        const param = new HttpParams().set('companyId',companyId);
        const API = 'ConfigurationApi/GetConfigurationForEmployee';
        return this.httpClient.get<any[]>(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });   
    }

    getConfigForApplicant(status,companyId){    
        const param = new HttpParams().set('type', status).set('companyId',companyId);
        const API = 'ConfigurationApi/GetConfigurationForApplicant';
        return this.httpClient.get<any[]>(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }
}
