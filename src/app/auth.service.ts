import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logout() {
    localStorage.removeItem('config');
    localStorage.removeItem('token');
    localStorage.removeItem('record_schema');
    /*let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + localStorage.getItem('token')
    })*/
    return;// this.http.get(environment.api +  '/api-auth/logout/?format=json', { headers: headers });
  }
  constructor(private http: HttpClient) { }
  login(user, pass) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.post(environment.api + "/api-token-auth/", { username: user, password: pass }, { headers: headers });
  }
}
