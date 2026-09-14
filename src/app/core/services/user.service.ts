import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateAdminUserRequest, CreateAdminUserResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  createAdmin(payload: CreateAdminUserRequest): Observable<CreateAdminUserResponse> {
    return this.http.post<CreateAdminUserResponse>(`${environment.apiUrl}/users/admin`, payload);
  }
}
