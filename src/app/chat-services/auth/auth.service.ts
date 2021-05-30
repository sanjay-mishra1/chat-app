import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  window = {
    recaptchaVerifier: undefined,
  };
  user: Observable<any>;
  constructor(private fauth: AngularFireAuth, private router: Router) {
    this.user = fauth.authState;
  }
  signinByGoogle() {
    this.fauth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.fauth.signOut().then((data) => {
      localStorage.removeItem('user');
      this.router.navigateByUrl('/login');
    });
  }
  signinByFacebook() {
    this.fauth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
  }
  signinByMicrosoft() {
    let provider = new firebase.auth.OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      prompt: 'consent',
      tenant: '6962cf35-b8b1-450d-a323-ee79aa4b18c7',
    });
    provider.addScope('openid');
    this.fauth.signInWithRedirect(provider);
  }
  signinByTwitter() {
    this.fauth.signInWithRedirect(new firebase.auth.TwitterAuthProvider());
  }
  signiByOtp(mobileNumber: string) {
    //recaptcha-container
    console.log('initializing captcha');
    this.sendOtp(mobileNumber);
    this.window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'visible',
        callback: (response) => {
          console.log('captcha solved sending.....');
          this.sendOtp(mobileNumber);
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          console.log('captcha expired.....');
          // ...
        },
      }
    );
  }
  sendOtp(mobileNumber: string) {
    console.log('Sending the code');
    this.fauth
      .signInWithPhoneNumber(
        '+91' + mobileNumber,
        this.window.recaptchaVerifier
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
