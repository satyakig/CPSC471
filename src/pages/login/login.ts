import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from './../../data_structures/user';
import { SignupPage } from '../signup/signup';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  user = {} as User;

  constructor(private afAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  async loginuser(user: User) {
    try{
    const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if(result) {
        this.navCtrl.popToRoot();
      }
    }
    catch(e){
      console.error(e);
    }
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

}
