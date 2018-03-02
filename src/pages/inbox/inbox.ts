import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

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

  constructor(private afAuth: AngularFireAuth, public afDb: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams,
  public loader: LoadingController, public platform: Platform, public services: Services) {
    this.parentNav = navParams.data;
  }

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Fetching messages...',
      duration: 250
    });
    loader.present();
    this.messages = this.afDb.list<Message>('users/' + this.services.auth.getUID() + '/messages').valueChanges();
  }

  messageClick(message: any) {
    console.log(message);
  } 

}
