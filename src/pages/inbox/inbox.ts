import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Observable } from '@firebase/util';
import { Message } from '../../data_structures/message';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {

  parentNav: any;

  welcomeemail: Message = {
      title: "Welcome to Movie App",
      recipient: this.afAuth.auth.currentUser.uid,
      message: "Thank you for signing up for Movie App!",
      date: new Date().toISOString().
      replace(/T/, ' ').      // replace T with a space
      replace(/\..+/, '')     // delete the dot and everything after
  }

  messages: Observable<Message[]>;
  desktop: boolean = true;

  constructor(private afAuth: AngularFireAuth, public afDb: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams,
  public loader: LoadingController, public platform: Platform) {


    this.parentNav = navParams.data;
  }

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Fetching messages...',
      duration: 250
    });
    loader.present();
    this.desktop = this.platform.is('core');
  }

  getMessages(){
    return this.afDb.list<Message>('messages/');
  }

  addMessage(email: Message){
    this.afDb.list<Message>('messages/').push(email);
  }

  addWelcomeMessage(){
    this.afDb.list<Message>('messages/').push(this.welcomeemail);
  }

  messageClick(id: string){
    
  }

}
