import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class CatalogueApiService {
    // URL = 'https://localhost:5001/';
    URL = AppSettings.BASEURL;
    constructor(
        private httpClient: HttpClient,
    ) { }

    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    getAllCatalogue(status) {
        const param = new HttpParams().set('status', status)
        const API = 'api/Catalogue/GetAllCatalogue';
        return this.httpClient.get<any[]>(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }

    insertCatalogue(catalogue) {
        const API = 'api/Catalogue/CreateCatalogue';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE + API, catalogue);
    }

    updateCatalogue(Catalogue) {
        const API = 'api/Catalogue/UpdateCatalogue';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, Catalogue);
    }

    removeCatalogue(Catalogue) {
        const API = 'api/Catalogue/RemoveCatalogue';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, Catalogue);
    }



}
