import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  email: string = '';
  pass: string = '';
  name: string = '';

  showSignup: boolean = false;

  constructor(private afAuth: AngularFireAuth, public afDb: AngularFireDatabase, public navCtrl: NavController, 
    public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController) 
  { }

  login() {
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Logging in...',
    });
    loader.present();

    if(this.email != '' && this.pass != '') {
      this.afAuth.auth.signInWithEmailAndPassword(this.email, this.pass).then(() => {
        loader.dismiss();
        this.viewCtrl.dismiss();
      }).catch(err => {
        loader.dismiss();
        this.showError(err.message);
      });
    }
    else {
      loader.dismiss();
      this.showError("Fields cannot be empty.");    
    }
  }

  showSignUp() {
    this.showSignup = true;
  }

  signUp() {
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Signing up...',
    });
    loader.present();

    if(this.email != '' && this.pass != '' && this.name != '') {
      this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.pass).then(() => {

        this.afDb.object('users/' + this.afAuth.auth.currentUser.uid).set({
          email: this.afAuth.auth.currentUser.email,
          name: this.name.trim(),
          userID: this.afAuth.auth.currentUser.uid
        }).then(() => {
          loader.dismiss();
          this.viewCtrl.dismiss();
        });

      }).catch(err => {
        loader.dismiss();
        this.showError(err.message);
      });
    }
    else {
      loader.dismiss();
      this.showError("Fields cannot be empty.");    
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  showError(msg: string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  showSuccessSignUp() {
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: 'You have been signed up!',
      buttons: ['OK']
    });
    alert.present();
  }
}
