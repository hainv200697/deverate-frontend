import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class ConfigurationApiService {
    URL = 'http://localhost:58810/';
    constructor(private httpClient: HttpClient) { }
    
    getAllConfiguration(status: boolean) {
        const API = 'ConfigurationAPI/GetAllConfiguration?isActive=';
        return this.httpClient.get(this.URL + API + status);
    }

}