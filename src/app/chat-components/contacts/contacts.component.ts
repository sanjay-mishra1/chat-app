import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/chat-models/user/user.model';
import { UserService } from 'src/app/chat-services/user/user.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  @Input() showUserMessageFn: (args: any) => void;
  constructor(private _userService: UserService) {}
  userList: User[];
  tempList: any[] = [];
  size: number = 0;
  currentUserId = localStorage.user;
  _currentUserMessageOpened: string;
  errorMsg: string;
  ngOnInit(): void {
    this._userService.getContacts().subscribe((data) => {
      this.tempList = [];
      this.size = data.length;
      if (this.size == 0) this.errorMsg = 'No contacts found';
      else this.errorMsg = '';
      data.forEach((user) => {
        const id: string = user.payload.doc.id;
        this.getUser({
          ...user.payload.doc.data(),
          id: id.replace(this.currentUserId, '').replace('-', ''),
        });
      });
    });
  }
  async getUser(user) {
    let userData: User = await this._userService.searchUser(user.id, true);
    let index = this.tempList.findIndex((u: any) => u.userid == user.id);
    if (index == -1) this.tempList.push({ ...user, ...userData[0] });
    else this.tempList[index] = { ...user, ...userData[0] };
    if (this.size == this.tempList.length) {
      this.userList = [];
      this.userList = this.tempList;
    }
  }
  openMessages(user) {
    this._currentUserMessageOpened = user.id;
    this.showUserMessageFn(user);
  }
}
