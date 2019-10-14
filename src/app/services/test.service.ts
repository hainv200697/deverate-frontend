import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  // URL = 'http://localhost:54318/';
  URL = AppSettings.BASEURL;
  routes = 'testmanagement/';
  constructor(private httpClient: HttpClient) { }

  getAllCompany(accountId) {
    const API = 'api/Test/MyConfigTest/';
    return this.httpClient.get<any>(this.URL + this.routes + API + accountId);
  }

  getAllQuestion(info) {
    const API = 'api/Test/MyTest';
    return this.httpClient.post<any>(this.URL + this.routes + API, info);
  }
}
