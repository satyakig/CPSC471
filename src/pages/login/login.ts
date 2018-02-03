import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/models/user';
import { SignupPage } from '../signup/signup';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async loginuser(user: User){
    try{
    const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if( result){
        this.navCtrl.popToRoot();
      }
    }
    catch(e){
      console.error(e);
    }
  }

  signup(){
    this.navCtrl.push('SignupPage');
  }

}
