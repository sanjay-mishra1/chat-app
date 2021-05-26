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

  currentUserId = localStorage.user;
  ngOnInit(): void {
    this._userService.getContacts().subscribe((data) => {
      this.userList = [];
      console.log(data);
      data.forEach((user) => {
        const id: string = user.payload.doc.id;
        this.getUser({
          ...user.payload.doc.data(),
          id: id.replace(this.currentUserId, '').replace('-', ''),
        });
      });
      console.log(this.userList);
    });
  }
  async getUser(user) {
    let userData: User = await this._userService.searchUser(user.id, true);
    let index = this.userList.findIndex((u: any) => u.userid == user.id);
    if (index == -1) this.userList.push({ ...user, ...userData[0] });
    else userData[index] = { ...user, ...userData[0] };
  }
}
