import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/chat-models/user/user.model';
import * as firebase from 'firebase';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFirestore) {}
  storeUserProfile(user: any) {
    let userDb: any = {
      displayName: user.displayName.toLowerCase(),
      email: user.email,
      photoURL: user.photoURL,
      lastSeen: firebase.default.firestore.FieldValue.serverTimestamp(),
      userid: user.uid,
    };
    console.log(userDb);
    localStorage.setItem('user', user.uid);
    this.db
      .collection('users')
      .doc(user.uid)
      .collection('profile')
      .doc('personal')
      .set(userDb);
  }
  async searchUser(key: string, isUserid?: boolean): Promise<any> {
    let dbData: any = [];
    return new Promise((resolve, reject) => {
      try {
        this.db
          .collectionGroup('profile', (ref) =>
            ref
              .orderBy(isUserid ? 'userid' : 'displayName')
              .startAt(key)
              .endAt(key + '\uf8ff')
              .limit(10)
          )
          .get()
          .subscribe((data) => {
            data.docs.forEach((d: any) => {
              var contact = d.data();
              if (contact.userid !== localStorage.user) dbData.push(contact);
            });
            resolve(dbData);
          });
      } catch (err) {
        reject(err);
      }
    });
    return dbData;
  }
  errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return throwError(error.message || 'Server Error');
  }
}
