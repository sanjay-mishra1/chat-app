import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './chat-components/login/login.component';
import { HomeComponent } from './chat-components/home/home.component';
import { UserService } from './chat-services/user/user.service';
import materialUiModules from './material-ui.modules';
import { MessageService } from './chat-services/message/message.service';
import { AuthService } from './chat-services/auth/auth.service';
import { ContactsComponent } from './chat-components/contacts/contacts.component';
import { MessageComponent } from './chat-components/message/message.component';
import { FormsModule } from '@angular/forms';
import { SETTINGS as AUTH_SETTINGS } from '@angular/fire/auth';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ContactsComponent,
    MessageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    materialUiModules,
    FormsModule,
  ],
  providers: [
    UserService,
    MessageService,
    AuthService,
    {
      provide: AUTH_SETTINGS,
      useValue: { appVerificationDisabledForTesting: true },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
