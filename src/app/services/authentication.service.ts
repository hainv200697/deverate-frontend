import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../appsetting';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient) { }

  login(account: any) {
    return this.httpClient.post<any>(`${AppSettings.BASEURL}${AppSettings.ROUTE_AUTH}Account/Login`, account);
  }
}
