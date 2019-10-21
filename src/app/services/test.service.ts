import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  URL = AppSettings.BASEURL;
  constructor(private httpClient: HttpClient) { }

  getAllTestInfo(accountId) {
    const API = 'api/Test/AllMyTestToday/';
    return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_TEST + API + accountId);
  }

  getConfig(testId) {
    const API = 'api/Test/GetConfig/';
    return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_TEST + API + testId);
  }

  getAllQuestion(info) {
    const API = 'api/Test/MyTest';
    return this.httpClient.post<any>(this.URL + AppSettings.ROUTE_TEST + API, info);
  }

  postSubmitTest(userTest) {
    const API = 'api/Test/SubmitTest';
    return this.httpClient.post<any>(this.URL + AppSettings.ROUTE_TEST+ API, userTest);
  }

  postAutoSaveTest(userTest) {
    const API = 'api/Test/AutoSave';
    return this.httpClient.post<any>(this.URL + AppSettings.ROUTE_TEST + API, userTest);
  }
}
