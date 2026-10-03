import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateAdminUserRequest, CreateAdminUserResponse } from '../models/user.model';
import { CachedResource } from '../utils/cached-resource';

// TODO(backend): there is no GET /api/v1/users/me route yet — this is a guessed shape
// (mirrors CreateAdminUserResponse's {user, house} pairing) mocked until it exists.
const MOCK_CURRENT_SESSION: CreateAdminUserResponse = {
  user: {
    id: 'mock-user-ana',
    name: 'Ana',
    email: 'ana@example.com',
    isAdmin: true,
    houseId: 'mock-house-1',
  },
  house: {
    id: 'mock-house-1',
    name: 'Casa da Ana',
    imagePath: null,
  },
};

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  readonly currentSession = new CachedResource(() => this.getCurrentUser());

  createAdmin(payload: CreateAdminUserRequest): Observable<CreateAdminUserResponse> {
    return this.http.post<CreateAdminUserResponse>(`${environment.apiUrl}/users/admin`, payload);
  }

  getCurrentUser(): Observable<CreateAdminUserResponse> {
    return of(MOCK_CURRENT_SESSION).pipe(delay(200));
  }
}
