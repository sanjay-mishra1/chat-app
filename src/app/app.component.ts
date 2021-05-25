import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { User } from './chat-models/user/user.model';
import { AuthService } from './chat-services/auth/auth.service';
import { UserService } from './chat-services/user/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'chat-app';
  constructor(
    private auth: AuthService,
    private user: UserService,
    private router: Router
  ) {
    this.auth.user.subscribe((user) => {
      if (!user) return;
      //userService.save(user);
      this.user.storeUserProfile(user);
      //localStorage.removeItem('returnValue');
      router.navigateByUrl('/');
    });
  }
}
