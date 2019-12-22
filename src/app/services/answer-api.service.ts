import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class AnswerApiService {
    // URL = 'http://localhost:9000/';
    URL = AppSettings.BASEURL;
    constructor(
        private httpClient: HttpClient,
    ) { }

    getAllAnswerByQuestioId(questionId, status) {
        const API = 'api/Answer/GetAnswerByQuestion';
        const param = new HttpParams().set('id', questionId).set('status', status);
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }

    insertAnswer(answer: any) {
        const API = 'api/Answer/CreateAnswer';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE + API, answer);
    }

    updateAnswer(answer: any) {
        const API = 'api/Answer/UpdateAnswer';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, answer);
    }

    disableAnswer(AnswerId: any) {
        const API = 'api/Answer/RemoveAnswer';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, AnswerId);
    }
    getAllDefaultAnswerByQuestioId(questionId, status) {
        const API = 'api/Answer/GetDefaultAnswerByQuestion';
        const param = new HttpParams().set('id', questionId).set('status', status);
        return this.httpClient.get(this.URL + AppSettings.ROUTE_RESOURCE + API, { params: param });
    }

    insertDefaultAnswer(answer: any) {
        const API = 'api/Answer/CreateAnswerDefault';
        return this.httpClient.post(this.URL + AppSettings.ROUTE_RESOURCE + API, answer);
    }

    updateDefaultAnswer(answer: any) {
        const API = 'api/Answer/UpdateAnswerDefault';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, answer);
    }

    disableDefaultAnswer(AnswerId: any) {
        const API = 'api/Answer/RemoveAnswerDefault';
        return this.httpClient.put(this.URL + AppSettings.ROUTE_RESOURCE + API, AnswerId);
    }


}
