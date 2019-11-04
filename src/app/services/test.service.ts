import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  URL = 'http://localhost:8080/';
  // URL = AppSettings.BASEURL;
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
  getTestByConfigId(id){
    const param = new HttpParams().set('id', id);
    const API = 'api/Test/GetAllTest/';
    return this.httpClient.get<any>(this.URL + AppSettings.ROUTE_TEST + API, { params: param });
  }

  getAllQuestionManager(info) {
    const API = 'api/Test/ManagerInTest';
    return this.httpClient.post<any>(this.URL + AppSettings.ROUTE_RESOURCE  + API, info);
  }

}
