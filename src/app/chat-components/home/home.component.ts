import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from 'src/app/chat-models/user/user.model';
import { AuthService } from 'src/app/chat-services/auth/auth.service';
import { UserService } from 'src/app/chat-services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  imageUrl: string;
  userName: string;
  searchResult: any = null;
  timer;
  searchKey = '';
  currentUid: string = null;
  username: string = null;
  constructor(private auth: AuthService, private user: UserService) {}

  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      if (user) {
        let data: User = user;
        this.imageUrl = data.photoURL;
        this.userName = data.displayName;
      }
    });
  }
  logout() {
    this.auth.logout();
  }
  searchContact() {
    clearTimeout(this.timer);
    console.log(this.searchKey);
    this.timer = setTimeout(() => {
      if (this.searchKey)
        this.user.searchUser(this.searchKey.toLowerCase()).then((response) => {
          this.searchResult = response;
        });
    }, 1000);
  }
  hideSearch() {
    this.searchResult = null;
    this.searchKey = '';
    console.log(this.searchKey);
  }
  selectUser(userid: string) {
    this.user.searchUser(userid, true).then((response) => {
      this.username = response[0].displayName;
    });
  }
}
