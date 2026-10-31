import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateAdminUserRequest, CreateAdminUserResponse, CurrentUserResponse } from '../models/user.model';
import { CachedResource } from '../utils/cached-resource';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  readonly currentSession = new CachedResource(() => this.getCurrentUser());

  createAdmin(payload: CreateAdminUserRequest): Observable<CreateAdminUserResponse> {
    return this.http.post<CreateAdminUserResponse>(`${environment.apiUrl}/users/admin`, payload);
  }

  getCurrentUser(): Observable<CurrentUserResponse> {
    return this.http.get<CurrentUserResponse>(`${environment.apiUrl}/users/me`);
  }
}
