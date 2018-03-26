import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';

import { Services } from './../../services/services';
import { Message } from '../../data_structures/message';

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {

  parentNav: any;

  messages: Observable<Message[]>;

  constructor(public afDb: AngularFireDatabase, public loader: LoadingController, public services: Services) { }

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Fetching messages',
    });
    loader.present();
    this.messages = this.afDb.list<Message>('users/' + this.services.auth.getUID() + '/messages').valueChanges().map(array => array.reverse());
    loader.dismiss();
  }

  messageClick(message: any) {
    console.log(message);
  } 
}
