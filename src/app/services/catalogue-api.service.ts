import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class CatalogueApiService {
    // URL = 'http://localhost:54318/';
    URL = AppSettings.BASEURL;
    routes = 'resource/';
    constructor(
        private httpClient: HttpClient,
    ) { }

    getAllCatalogue() {
        const API = 'api/Catalogue/GetAllCatelogue';
        return this.httpClient.get<any[]>(this.URL + this.routes + API);
    }

    insertCatalogue(catalogue) {
        console.log(catalogue);
        const API = 'CatelogueAPI/CreateCatalogue';
        return this.httpClient.post(this.URL + API, catalogue);
    }

    updateCatalogue(Catalogue) {
        const API = 'CatelogueAPI/UpdateCatalogue';
        return this.httpClient.put(this.URL + API, Catalogue);
    }

    removeCatalogue(Catalogue) {
        const API = 'CatelogueAPI/RemoveCatalogue';
        return this.httpClient.put(this.URL + API, Catalogue);
    }


}
