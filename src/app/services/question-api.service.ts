import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class QuestionApiService {
    URL = 'http://localhost:58810/swagger/';
    constructor(private httpClient: HttpClient) { }
    
    getAllQuestion() {
        const API = 'Question/Question_GetAllQuestion';
        return this.httpClient.get(this.URL + API );
    }
    
    insertQuestion(QuestionModel) {
        const API = 'QuestionAPI/CreatQuestion';
        return this.httpClient.post(this.URL+API,QuestionModel );
    }


}