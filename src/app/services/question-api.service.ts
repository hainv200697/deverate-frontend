import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { QuestionModel } from '../models/question-model';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class QuestionApiService {
    URL = AppSettings.BASEURL;
    // URL ='http://localhost:54318/';
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    constructor(private httpClient: HttpClient) { }
    
    getQuestion(id:any,status) {
        let param= new HttpParams().set('id',id).set('status',status);
        const API = 'api/Question/GetQuestionByCatalogue';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API,{params :param} );
    }

    insertQuestion(question: any) {
        const API = 'api/Question/CreateQuestion';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE+ API, question);
    }

    updateQuestion(question: any) {
        const API = 'api/Question/UpdateQuestion';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE+ API, question);
    }
    removeQuestion(question: any) {
        const API = 'api/Question/RemoveQuestion';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, question);
    }

    insertQuestionByExcel(question: any) {
        const API = 'api/Question/CreateQuestionExcel';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE + API, question);
    }

    getQuestionByStatus(status, id) {
        const param = new HttpParams().set('status', status).set('id', id);
        const API = 'api/Question/GetQuestionByStatus';
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }
}
