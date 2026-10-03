import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Activity } from '../models/activity.model';

// TODO(backend): there is no activity/audit-log entity in the backend domain model yet
// (CLAUDE.md only documents House/User/Item/Tag/Invite) — this whole feature is speculative.
// Confirm with the backend repo/team before wiring a real endpoint in place of this mock.
const MOCK_ACTIVITY: Activity[] = [
  {
    id: 'mock-activity-1',
    userName: 'João',
    userAvatarUrl: '/mock/avatars/joao.jpg',
    action: 'purchased',
    itemName: 'Arroz',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-activity-2',
    userName: 'Ana',
    userAvatarUrl: '/mock/avatars/ana.png',
    action: 'added_to_list',
    itemName: 'Detergente',
    createdAt: new Date(new Date().setHours(8, 30, 0, 0)).toISOString(),
  },
  {
    id: 'mock-activity-3',
    userName: 'Ana',
    userAvatarUrl: '/mock/avatars/ana.png',
    action: 'restocked',
    itemName: 'Sabonete',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
];

@Injectable({ providedIn: 'root' })
export class ActivityService {
  getRecentActivity(limit = 3): Observable<Activity[]> {
    return of(MOCK_ACTIVITY.slice(0, limit)).pipe(delay(200));
  }
}
