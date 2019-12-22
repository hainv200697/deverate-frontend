import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { QuestionModel } from '../models/question-model';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class QuestionApiService {
    // URL = AppSettings.BASEURL;
    URL ='http://localhost:9000/';
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    constructor(private httpClient: HttpClient) { }
    
    getQuestion(id,companyId,status) {
        let param= new HttpParams().set('catalogueId',id).set('companyId',companyId).set('status',status);
        const API = 'api/Question/GetQuestionByCatalogue';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API,{params :param} );
    }

    insertQuestion(question) {
        const API = 'api/Question/CreateQuestion';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE+ API, question);
    }

    updateQuestion(question) {
        const API = 'api/Question/UpdateQuestion';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE+ API, question);
    }
    removeQuestion(question) {
        const API = 'api/Question/RemoveQuestion';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, question);
    }

    getQuestionDefault(id,status) {
        let param= new HttpParams().set('catalogueId',id).set('status',status);
        const API = 'api/Question/GetQuestionByCatalogueDefault';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API,{params :param} );
    }

    insertQuestionDefault(question) {
        const API = 'api/Question/CreateDefaultQuestion';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE+ API, question);
    }

    updateQuestionDefault(question) {
        const API = 'api/Question/UpdateQuestionDefault';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE+ API, question);
    }
    removeQuestionDefault(question) {
        const API = 'api/Question/RemoveQuestionDefault';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, question);
    }
}
