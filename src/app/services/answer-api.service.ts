import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class AnswerApiService {
    // URL = 'http://localhost:54318/';
    URL = AppSettings.BASEURL;
    routes = 'resource/';
    constructor(
        private httpClient: HttpClient,
    ) { }

    getAllAnswerByQuestioId(questionId: string) {
        const API = 'AnswerAPI/GetAnswerByQuestionId';
        const param = new HttpParams().set('id', questionId);
        return this.httpClient.get(this.URL + this.routes + API, { params: param });
    }

    insertAnswer(answer: any) {
        const API = 'AnswerAPI/CreateAnswerAPI';
        return this.httpClient.post(this.URL + API, answer);
    }

    updateAnswer(answer: any) {
        const API = 'AnswerAPI/UpdateAnswer';
        return this.httpClient.put(this.URL + API, answer);
    }

    disableAnswer(AnswerId: any) {
        const API = 'AnswerAPI/DisableAnswer';
        return this.httpClient.put(this.URL + API, AnswerId);
    }


}
