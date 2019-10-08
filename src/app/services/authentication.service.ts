import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  login(account:any) {
    return this.httpClient.post<any>(`${AppSettings.BASEURL}authenticate/api/Login/Authen`, account, this.httpOptions);
  }
}
