import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../appsetting';
@Injectable({
    providedIn: 'root'
})
export class QuestionApiService {
    // URL = 'http://localhost:54318/';
    URL = AppSettings.BASEURL;
    routes = 'resource/';
    constructor(private httpClient: HttpClient) { }

    getAllQuestion() {
        const API = 'api/Question/GetAllQuestion';
        return this.httpClient.get(this.URL + this.routes + API);
    }

    insertQuestion(question: any) {
        const API = 'api/Question/CreatQuestion';
        return this.httpClient.post(this.URL + this.routes + API, question);
    }

    updateQuestion(question: any) {
        const API = 'api/Question/UpdateQuestion';
        return this.httpClient.put(this.URL + this.routes + API, question);
    }
    removeQuestion(question: any) {
        const API = 'api/Question/RemoveQuestion';
        return this.httpClient.put(this.URL + this.routes + API, question);
    }
}
