import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Tag } from '../models/tag.model';
import { CachedResource } from '../utils/cached-resource';

// TODO(backend): no /tags routes exist yet. The shape below is a guess (a house-scoped tag
// list, per CLAUDE.md's House-scoping rule) — confirm against the backend repo before
// replacing this mock with a real HTTP call.
export const MOCK_TAGS: Tag[] = [
  { id: 'tag-limpeza', name: 'Limpeza', houseId: 'mock-house-1' },
  { id: 'tag-despensa', name: 'Despensa', houseId: 'mock-house-1' },
  { id: 'tag-higiene', name: 'Higiene', houseId: 'mock-house-1' },
  { id: 'tag-cozinha', name: 'Cozinha', houseId: 'mock-house-1' },
  { id: 'tag-graos', name: 'Grãos', houseId: 'mock-house-1' },
  { id: 'tag-banheiro', name: 'Banheiro', houseId: 'mock-house-1' },
  { id: 'tag-bebidas', name: 'Bebidas', houseId: 'mock-house-1' },
  { id: 'tag-padaria', name: 'Padaria', houseId: 'mock-house-1' },
  { id: 'tag-hortifruti', name: 'Hortifruti', houseId: 'mock-house-1' },
  { id: 'tag-frios', name: 'Frios', houseId: 'mock-house-1' },
];

@Injectable({ providedIn: 'root' })
export class TagService {
  readonly tags = new CachedResource(() => this.getTags());

  getTags(): Observable<Tag[]> {
    return of([...MOCK_TAGS]).pipe(delay(200));
  }
}
