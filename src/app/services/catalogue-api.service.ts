import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class CatalogueApiService {
    URL = 'http://localhost:54318/';
    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    constructor(
        private httpClient: HttpClient,
    ) { }
    
    getAllCatalogue(){
        const API = 'api/Catalogue/GetAllCatalogue';
        return this.httpClient.get(this.URL + API);
    }
    
    insertCatalogue(catalogue) {
        const API = 'api/Catalogue/CreateCatalogue';
        return this.httpClient.post(this.URL+API, catalogue);
    }

    updateCatalogue(Catalogue) {
        const API = 'api/Catalogue/UpdateCatalogue';
        return this.httpClient.put(this.URL+API,Catalogue, this.httpOptions);
    }

    removeCatalogue(Catalogue) {
        const API = 'CatalogueAPI/RemoveCatalogue';
        return this.httpClient.put(this.URL+API,Catalogue);
    }
    
    getCatalogueById(id){
        console.log(id);
        let param = new HttpParams().set('id',id);
        const API = 'api/Catalogue/GetCatalogueById';
        return this.httpClient.get(this.URL + API,{params:param});
    }

}