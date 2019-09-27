import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class CatalogueApiService {
    URL = 'http://localhost:58810/';
    constructor(
        private httpClient: HttpClient,
    ) { }
    
    getCatalogueById(key:string):Observable<any> {
        const API = 'CatelogueAPI/GetCatelogueById';
        let id = new HttpParams().set('CatalogueId',key);
        return this.httpClient.get(this.URL + API, {params:id});
    }
    


}