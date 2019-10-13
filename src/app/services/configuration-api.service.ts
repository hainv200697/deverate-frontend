import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class ConfigurationApiService {
    URL = 'http://localhost:54318/';
    constructor(private httpClient: HttpClient) { }
    
    getAllConfiguration(status: boolean) {
        const API = 'ConfigurationAPI/GetAllConfiguration?isActive=';
        return this.httpClient.get(this.URL + API + status);
    }

    GetConfigurationCatalogueByConfigId(id: number){
        const API = 'ConfigurationApi/GetConfigurationById?id=';
        return this.httpClient.get(this.URL + API + id);
    }

    createConfigurartion(ConfigurationModel) {
        const API = 'ConfigurationApi/CreateConfiguration';
        return this.httpClient.post(this.URL + API, ConfigurationModel)

    }

    updateConfiguration(ConfigurationModel){
        const API = 'ConfigurationApi/UpdateConfiguration';
        return this.httpClient.put(this.URL + API, ConfigurationModel)
    }

    changeStatusConfiguration(ConfigurationModel){
        const API = 'ConfigurationApi/ChangeStatusConfiguration';
        return this.httpClient.put(this.URL + API, ConfigurationModel);
    }
}