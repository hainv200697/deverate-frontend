import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { QuestionModel } from '../models/question-model';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class QuestionApiService {
    // URL = AppSettings.BASEURL;
    URL ='http://localhost:54318/';
    // routes = 'resource/';
    routes = '';
    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    constructor(private httpClient: HttpClient) { }
    
    getQuestion(id:any) {
        let param= new HttpParams().set('id',id);
        const API = 'api/Question/GetQuestionByCatalogue';
        return this.httpClient.get(this.URL + this.routes + API,{params :param} );
    }
    
    insertQuestion(question:any) {
        const API = 'api/Question/CreateQuestion';
        return this.httpClient.post(this.URL + this.routes + API,question );
    }

    updateQuestion(question:any) {
        const API = 'api/Question/UpdateQuestion';
        return this.httpClient.put(this.URL + this.routes + API,question );
    }
    removeQuestion(question:any) {
        const API = 'api/Question/RemoveQuestion';
        return this.httpClient.put(this.URL + this.routes + API,question);
    }

    insertQuestionByExcel(question:any) {
        const API = 'api/Question/CreateQuestionExcel';
        return this.httpClient.post(this.URL + this.routes + API,question);
    }

    getQuestionByStatus(status,id){
        let param= new HttpParams().set('status',status);
        param.set('id',id);
        const API = 'api/Question/GetQuestionByStatus';
        return this.httpClient.get(this.URL + this.routes + API,{params :param} );
    }
}
