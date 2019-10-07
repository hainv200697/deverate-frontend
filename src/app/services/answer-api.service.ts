import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class AnswerApiService {
    URL = 'http://localhost:58810/';
    constructor(
        private httpClient: HttpClient,
    ) { }
    
    getAllAnswerByQuestioId(questionId: string){
        const API = 'AnswerAPI/GetAnswerByQuestionId';
        let param = new HttpParams().set('id',questionId);
        return this.httpClient.get(this.URL + API,{params:param});
    }

    insertAnswer(answer:any) {
        const API = 'AnswerAPI/CreateAnswerAPI';
        return this.httpClient.post(this.URL+API,answer);
    }
    
    updateAnswer(answer:any) {
        const API = 'AnswerAPI/UpdateAnswer';
        return this.httpClient.put(this.URL+API,answer);
    }

    disableAnswer(AnswerId:any){
        const API = 'AnswerAPI/DisableAnswer';
        return this.httpClient.put(this.URL + API,AnswerId);
    }


}