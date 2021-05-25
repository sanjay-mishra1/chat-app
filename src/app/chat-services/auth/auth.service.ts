import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<any>;
  constructor(private fauth: AngularFireAuth, private router: Router) {
    this.user = fauth.authState;
  }
  signinByGoogle() {
    this.fauth.signInWithRedirect(
      new firebase.default.auth.GoogleAuthProvider()
    );
  }
  logout() {
    this.fauth.signOut().then((data) => {
      localStorage.removeItem('user');
      this.router.navigateByUrl('/login');
    });
  }
}
