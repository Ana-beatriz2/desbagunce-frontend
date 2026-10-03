import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, User, getAuth, onIdTokenChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Observable, from, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private app = initializeApp(environment.firebaseConfig);
  private auth: Auth = getAuth(this.app);

  currentUser = signal<User | null>(this.auth.currentUser);
  idToken = signal<string | null>(null);

  constructor() {
    onIdTokenChanged(this.auth, async (user) => {
      this.currentUser.set(user);
      this.idToken.set(user ? await user.getIdToken() : null);
    });
  }

  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((credential) => credential.user),
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}
