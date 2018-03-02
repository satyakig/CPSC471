import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { HomePage } from '../pages/home/home';
import { UpcomingPage } from '../pages/upcoming/upcoming';
import { LoginPage } from './../pages/login/login';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  loggedIn: boolean = false;

  constructor(public platform: Platform, public statusBar: StatusBar, public afAuth: AngularFireAuth,
    public splashScreen: SplashScreen, public modalCtrl: ModalController) {

    this.afAuth.authState.subscribe(
      (auth) => {
        if(auth)
          this.loggedIn = true;
        else 
          this.loggedIn = false;             
      }
    );

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  home() {
    this.nav.popToRoot();
  }

  upcomingMovies() {
    this.nav.push(UpcomingPage);
  }

  login() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }  

  logout() {
    this.nav.popToRoot().then(() => {
      this.afAuth.auth.signOut();
    });
  }
}
