import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/chat-models/user/user.model';
import { AuthService } from 'src/app/chat-services/auth/auth.service';
import { MessageService } from 'src/app/chat-services/message/message.service';
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
  currentUser: any = null;
  isMessageUrl: boolean = false;
  isMobileView: boolean = true;
  constructor(
    private auth: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isMessageUrl = this.route.snapshot.params['uid'] ? true : false;
    if (this.isMessageUrl) {
      this.userService
        .searchUser(this.route.snapshot.params['uid'], true)
        .then((user) => {
          this.selectUser(user[0]);
        });
    }
    this.auth.user.subscribe((user) => {
      if (user) {
        let data: User = user;
        this.imageUrl = data.photoURL;
        this.userName = data.displayName;
      }
    });
  }
  checkIfMobileView() {
    let element = document.getElementById('mobile-view');
    if (element) {
      var hidden = false;
      if (window.getComputedStyle(element).display == 'none') {
        hidden = true;
      }
      if (!hidden) {
        this.isMobileView = true;
      } else this.isMobileView = false;
    }
  }
  logout() {
    this.auth.logout();
  }
  searchContact() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.searchKey)
        this.userService
          .searchUser(this.searchKey.toLowerCase())
          .then((response) => {
            this.searchResult = response;
          });
    }, 1000);
  }
  hideSearch() {
    this.searchResult = null;
    this.searchKey = '';
  }
  selectUser = (user): void => {
    //this.currentUser = null;
    this.currentUser = user;
    this.checkIfMobileView();
    if (this.isMobileView) this.router.navigateByUrl('messages/' + user.userid);
  };
  clearChat() {
    if (this.currentUser)
      this.messageService.clearAllMessages(this.currentUser.userid);
  }
  back() {
    this.router.navigateByUrl('/');
  }
}
