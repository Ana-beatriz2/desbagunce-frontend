import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tag } from '../models/tag.model';
import { CachedResource } from '../utils/cached-resource';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class TagService {
  private http = inject(HttpClient);
  private userService = inject(UserService);

  readonly tags = new CachedResource(() => this.getCurrentHouseTags());

  getTags(houseId: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiUrl}/houses/${houseId}/tags`);
  }

  private getCurrentHouseTags(): Observable<Tag[]> {
    const houseId = this.userService.houseId();
    if (!houseId) {
      return throwError(() => new Error('No house in session'));
    }
    return this.getTags(houseId);
  }
}
