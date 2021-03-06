import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/User';
import { PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/Message';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.apiUrl;

  constructor (
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getUsers(page?: string, itemsPerPage?: string, userParams?: any, likeParams?: any): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (!!page && !!itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (!!userParams) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (!!likeParams) {
      if (likeParams === 'Likers') {
        params = params.append('likers', 'true');
      }
      if (likeParams === 'Likees') {
        params = params.append('likees', 'true');
      }
    }

    return this.http.get<User[]>(this.baseUrl + "users", { observe: "response", params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (!!response.headers.get('Pagination')) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
        }
        return paginatedResult;
      })
    )
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + "users/" + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + "users/" + id, user)
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + "users/" + userId + "/photos/" + id + "/setMain", {})
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + "users/" + userId + "/photos/" + id);
  }

  sendLike(userId: number, recipientId: number) {
    return this.http.post(this.baseUrl + "users/" + userId + "/like/" + recipientId, {});
  }

  getMessages(userId: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    let params = new HttpParams();
    params = params.append("MessageContainer", messageContainer);

    if (!!page && !!itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Message[]>(this.baseUrl + "users/" + userId + "/messages", { observe: "response", params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (!!response.headers.get('Pagination')) paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
        return paginatedResult;
      })
    )
  }

  getMessageThread(userId: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + "users/" + userId + "/messages/thread/" + recipientId)
  }

  sendMessage(userId: number, message: Message) {
    return this.http.post(this.baseUrl + "users/" + userId + "/messages", message)
  }

  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + "users/" + userId + "/messages/" + id, {})
  }

  markAsRead(userId: number, messageId: number) {
    this.http.post(this.baseUrl + "users/" + userId + "/messages/" + messageId + "/read", {}).subscribe()
  }
}
