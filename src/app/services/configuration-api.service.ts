import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class ConfigurationApiService {
    // URL = 'https://localhost:5001/';
    URL = AppSettings.BASEURL;
    constructor(private httpClient: HttpClient) { }

    getAllConfiguration(status: boolean) {
        const API = 'ConfigurationAPI/GetAllConfiguration?isActive=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE+ API + status);
    }

    GetConfigurationCatalogueByConfigId(id: number) {
        const API = 'ConfigurationApi/GetConfigurationById?id=';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE+ API + id);
    }

    createConfigurartion(ConfigurationModel) {
        const API = 'ConfigurationApi/CreateConfiguration';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE + API, ConfigurationModel);

    }

    updateConfiguration(ConfigurationModel) {
        const API = 'ConfigurationApi/UpdateConfiguration';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, ConfigurationModel);
    }

    changeStatusConfiguration(ConfigurationModel) {
        const API = 'ConfigurationApi/ChangeStatusConfiguration';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE+ API, ConfigurationModel);
    }

    sendCode(id){
        const API = 'api/System/SendTestMail/';
        return this.httpClient.get('http://localhost:8080/' + API + id);
    }
}
