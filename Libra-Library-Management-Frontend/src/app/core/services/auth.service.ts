import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post<any>(
        environment.apiUrl + '/Auth/Login',
        {
          username,
          password
        }
      )
      .pipe(
        tap(r => {
          localStorage.setItem(
            'libra_token',
            r?.token ?? r?.accessToken ?? ''
          );

          localStorage.setItem(
            'libra_role',
            r?.role ?? 'Administrator'
          );

          localStorage.setItem(
            'libra_name',
            r?.fullName ?? username
          );
        })
      );
  }

  register(p: any) {
    return this.http.post(
      environment.apiUrl + '/Auth/Register',
      p
    );
  }

  logout() {
    localStorage.clear();
  }

  name() {
    return localStorage.getItem('libra_name') ?? 'Menna Mohammed';
  }

  role() {
    return localStorage.getItem('libra_role') ?? 'Administrator';
  }
}

