import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class RankApiService {
    URL = 'http://localhost:54318/';
    constructor(private httpClient: HttpClient) { }

    getAllRank(isActive: boolean) {
        const API = 'RankApi/GetAllRank?isActive=';
        return this.httpClient.get(this.URL + API + isActive );
    }
}