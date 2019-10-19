import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class AnswerApiService {
    URL = 'http://localhost:54318/';
    // URL = AppSettings.BASEURL;
    // routes = 'resource/';
    routes = '';
    constructor(
        private httpClient: HttpClient,
    ) { }

    getAllAnswerByQuestioId(questionId) {
        const API = 'api/Answer/GetAnswerByQuestion';
        const param = new HttpParams().set('id', questionId);
        return this.httpClient.get(this.URL + this.routes + API, { params: param });
    }

    insertAnswer(answer: any) {
        const API = 'api/Answer/CreateAnswer';
        return this.httpClient.post(this.URL + API, answer);
    }

    updateAnswer(answer: any) {
        const API = 'api/Answer/UpdateAnswer';
        return this.httpClient.put(this.URL + API, answer);
    }

    disableAnswer(AnswerId: any) {
        const API = 'api/Answer/RemoveAnswer';
        return this.httpClient.put(this.URL + API, AnswerId);
    }


}
