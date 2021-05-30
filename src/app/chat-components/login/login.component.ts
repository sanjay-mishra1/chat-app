import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/chat-services/auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService) {}
  showMainScreen: boolean = true;
  showMobileScreen: boolean = false;
  showProgressScreen: boolean = false;
  windowRef;
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
  signinByOtp() {
    this.showMobileScreen = true;
    this.showMainScreen = false;
  }
  back() {
    this.showMainScreen = true;
    this.showMobileScreen = false;
  }
  async sendOtp(mobileNumber: string) {
    // this.windowRef = await this.windowService.windowRef;

    this.auth.signiByOtp(mobileNumber);
  }
}
