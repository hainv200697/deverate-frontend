import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  URL = 'http://localhost:54318/';
  constructor(private httpClient: HttpClient) { }

  getAllCompany(accountId) {
    console.log(accountId);
    const API = 'api/Test/MyConfigTest/';
    return this.httpClient.get<any>(this.URL + API + accountId);
  }

  getAllQuestion(info) {
    const API = 'api/Test/MyTest';
    return this.httpClient.post<any>(this.URL + API, info);
  }
}
