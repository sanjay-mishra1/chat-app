import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
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
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      userid: user.uid,
    };
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
  getContacts(): Observable<any> {
    let userid = localStorage.user;
    let data = this.db
      .collection('users')
      .doc(userid)
      .collection('messages', (ref) => ref.orderBy('time', 'desc'))
      .snapshotChanges();
    return data;
  }
  errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return throwError(error.message || 'Server Error');
  }
}
