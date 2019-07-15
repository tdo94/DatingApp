import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + "users");
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + "users/" + id);
  }
}