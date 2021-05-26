import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from 'src/app/chat-models/message/message.model';
import * as node from 'ts-node';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private db: AngularFirestore) {}
  getMessages(otherUser: any): Observable<any> {
    let data = this.db
      .collection('message')
      .doc(this.getMessageId(otherUser))
      .collection('message', (ref) => ref.orderBy('time', 'asc'))
      .snapshotChanges();
    return data;
  }
  decrementCounter(otherUser: string) {
    try {
      let messageId = this.getMessageId(otherUser);
      this.db
        .collection('users')
        .doc(localStorage.user)
        .collection('messages')
        .doc(messageId)
        .update({
          counter: 0,
        });
    } catch (error) {}
  }
  getMessageId(otherUser: string) {
    let currnetUserid = localStorage.user;
    if (currnetUserid > otherUser) otherUser = currnetUserid + '-' + otherUser;
    else otherUser = otherUser + '-' + currnetUserid;
    return otherUser;
  }
  sendMessage(otherUser: string, message: string) {
    let messageDb: Message = {
      from: localStorage.user,
      message,
      time: firebase.default.firestore.FieldValue.serverTimestamp(),
    };
    let messageId = this.getMessageId(otherUser);
    this.db
      .collection('message')
      .doc(messageId)
      .collection('message')
      .add(messageDb)
      .then((data) => {
        this.db
          .collection('users')
          .doc(localStorage.user)
          .collection('messages')
          .doc(messageId)
          .update({
            ...messageDb,
            counter: firebase.default.firestore.FieldValue.increment(1),
          })
          .then((data) => {
            this.db
              .collection('users')
              .doc(otherUser)
              .collection('messages')
              .doc(messageId)
              .update({
                ...messageDb,
                counter: firebase.default.firestore.FieldValue.increment(1),
              });
          })
          .catch((err) => {
            this.db
              .collection('users')
              .doc(localStorage.user)
              .collection('messages')
              .doc(messageId)
              .set({
                ...messageDb,
                counter: firebase.default.firestore.FieldValue.increment(1),
              });
            this.db
              .collection('users')
              .doc(otherUser)
              .collection('messages')
              .doc(messageId)
              .set({
                ...messageDb,
                counter: firebase.default.firestore.FieldValue.increment(1),
              });
          });
      })
      .catch((err) => {
        console.log('error occurred');
      });
  }
  clearChat(otherUser: string) {
    let messageId = this.getMessageId(otherUser);

    this.db
      .collection('message')
      .doc(messageId)
      .set(null)
      .then((data) => {
        console.log('data deleted from message root ', data);
        try {
          this.db
            .collection('users')
            .doc(localStorage.user)
            .collection('messages')
            .doc(messageId)
            .set(null);
          this.db
            .collection('users')
            .doc(otherUser)
            .collection('messages')
            .doc(messageId)
            .set(null);
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  clearAllMessages(otherUser: string) {
    let messageId = this.getMessageId(otherUser);
    const collectionRef = this.db
      .collection('message')
      .doc(messageId)
      .collection('message');
    const query = collectionRef;
    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(query, resolve).catch(reject);
    });
  }
  async deleteQueryBatch(query, resolve) {
    query.get().subscribe((snapshot) => {
      const batchSize = snapshot.size;
      if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
      }

      // Delete documents in a batch
      const batch = this.db.firestore.batch();
      console.log(snapshot);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      batch.commit();

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      this.deleteQueryBatch(query, resolve);
    });
  }
}
