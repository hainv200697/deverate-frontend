import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  URL = 'http://localhost:8080/';
  routes = '';
  // URL = AppSettings.BASEURL;
  // routes = 'testmanagement/';
  constructor(private httpClient: HttpClient) { }

  getAllTestInfo(accountId) {
    const API = 'api/Test/AllMyTestToday/';
    return this.httpClient.get<any>(this.URL + this.routes + API + accountId);
  }

  getConfig(testId) {
    const API = 'api/Test/GetConfig/';
    return this.httpClient.get<any>(this.URL + this.routes + API + testId);
  }

  getAllQuestion(info) {
    const API = 'api/Test/MyTest';
    return this.httpClient.post<any>(this.URL + this.routes + API, info);
  }

  postSubmitTest(questionInTest) {
    const API = 'api/Test/SubmitTest';
    return this.httpClient.post<any>(this.URL + this.routes + API, questionInTest);
  }
}
