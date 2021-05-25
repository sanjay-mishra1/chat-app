import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit {
  constructor() {}
  @Input() username: string;
  @Input() userid: string;
  ngOnInit(): void {
    console.log(this.username, this.userid);
  }
}
