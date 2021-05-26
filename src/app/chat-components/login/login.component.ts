import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/chat-services/auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit(): void {}
  signinByGoogle() {
    this.auth.signinByGoogle();
  }
  signinByTwitter() {
    this.auth.signinByTwitter();
  }
  signinByMicrosoft() {
    this.auth.signinByMicrosoft();
  }
  signinByFacebook() {
    this.auth.signinByFacebook();
  }
}
