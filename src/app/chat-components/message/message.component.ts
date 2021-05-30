import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/chat-models/message/message.model';
import { User } from 'src/app/chat-models/user/user.model';
import { MessageService } from 'src/app/chat-services/message/message.service';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit {
  constructor(private messageService: MessageService) {}
  _user: any;
  inputMessage: string;
  messageList: Message[] = [];
  userid = localStorage.user;
  messageObserve: any;
  @Input() set user(value: User) {
    this.messageList = [];
    if (this.messageObserve) this.messageObserve.unsubscribe();
    this._user = value;
    this.messageObserve = this.messageService
      .getMessages(this._user.userid)
      .subscribe((data) => {
        this.messageList = [];

        data.forEach((message) => {
          const data = message.payload.doc.data() as Message;
          if (data.time) data.time = data.time.toDate();
          else data.time = new Date();
          this.messageList.push(data);
        });
        this.autoScrollToBottom();
        this.messageService.decrementCounter(this._user.userid);
      });
  }

  get user(): User {
    return this._user;
  }
  ngOnInit(): void {}
  sendMessage(message: string) {
    if (message.trim())
      this.messageService.sendMessage(this._user.userid, message);
    this.inputMessage = '';
  }
  autoScrollToBottom() {
    setTimeout(() => {
      try {
        var elmnt = document.getElementById('last-element');
        elmnt.scrollIntoView();
      } catch (e) {}
    }, 10);
  }
}
