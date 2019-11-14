import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GloblaService {
    public checkMail =  /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public checkPhoneVn = /((09|03|07|08|05)+([0-9]{8})\b)/g;
}