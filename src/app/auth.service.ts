import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getBackend():string {
    return localStorage.getItem("backend")||environment.api
  }
  logout() {
    localStorage.removeItem('config');
    localStorage.removeItem('token');
    localStorage.removeItem('record_schema');
    return;
  }
  constructor(private http: HttpClient) { }
  login(user, pass) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.post(this.getBackend() + "/api-token-auth/", { username: user, password: pass }, { headers: headers });
  }
}
