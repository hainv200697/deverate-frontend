import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class CatalogueApiService {
    URL = 'http://localhost:54318/';
    routes ='';
    // URL = AppSettings.BASEURL;
    // routes = 'resource/';
    constructor(
        private httpClient: HttpClient,
    ) { }

    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    getAllCatalogue() {
        const API = 'api/Catalogue/GetAllCatalogue';
        return this.httpClient.get<any[]>(this.URL + this.routes + API);
    }

    insertCatalogue(catalogue) {
        const API = 'api/Catalogue/CreateCatalogue';
        return this.httpClient.post(this.URL + this.routes + API, catalogue);
    }

    updateCatalogue(Catalogue) {
        const API = 'api/Catalogue/UpdateCatalogue';
        return this.httpClient.put(this.URL + this.routes + API, Catalogue);
    }

    removeCatalogue(Catalogue) {
        const API = 'api/Catalogue/RemoveCatalogue';
        return this.httpClient.put(this.URL + this.routes + API, Catalogue);
    }

    getCatalogueById(id) {
        console.log(id);
        const param = new HttpParams().set('id', id);
        const API = 'api/Catalogue/GetCatalogueById';
        return this.httpClient.get(this.URL + this.routes + API, { params: param });
    }


}
