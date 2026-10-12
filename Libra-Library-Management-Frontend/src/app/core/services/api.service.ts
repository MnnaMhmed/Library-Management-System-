
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token =
      localStorage.getItem('libra_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken');

    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  get<T>(e: string) {
    return this.http.get<T>(
      `${environment.apiUrl}/${e}`,
      { headers: this.getHeaders() }
    );
  }

  getOne<T>(e: string, id: number) {
    return this.http.get<T>(
      `${environment.apiUrl}/${e}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  post<T>(e: string, p: any) {
    return this.http.post<T>(
      `${environment.apiUrl}/${e}`,
      p,
      { headers: this.getHeaders() }
    );
  }

  put<T>(e: string, id: number, p: any) {
    return this.http.put<T>(
      `${environment.apiUrl}/${e}/${id}`,
      p,
      { headers: this.getHeaders() }
    );
  }

  delete(e: string, id: number) {
    return this.http.delete(
      `${environment.apiUrl}/${e}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // Users: GET /api/Users/GetUserById{id}
  getUserById(id: number) {
    return this.http.get(
      `${environment.apiUrl}/Users/GetUserById${id}`,
      { headers: this.getHeaders() }
    );
  }

  // Users: DELETE /api/Users/DeleteUser{id}
  deleteUserById(id: number) {
    return this.http.delete(
      `${environment.apiUrl}/Users/DeleteUser${id}`,
      { headers: this.getHeaders() }
    );
  }
}
