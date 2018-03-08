import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Nav, Platform, ModalController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { HomePage } from '../pages/home/home';
import { EmployeePage } from '../pages/employee/employee';
import { UpcomingPage } from '../pages/upcoming/upcoming';
import { LoginPage } from './../pages/login/login';
import { AccountPage } from './../pages/account/account';
import { Services } from './../services/services';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  root = HomePage;

  loggedIn: boolean = false;
  access: number = 2;

  constructor(public platform: Platform, public statusBar: StatusBar, public afAuth: AngularFireAuth,
    public splashScreen: SplashScreen, public modalCtrl: ModalController, public services: Services, public loader: LoadingController) {

    this.afAuth.authState.subscribe(
      (auth) => {
        if(auth) {
          this.loggedIn = this.services.auth.isLoggedIn();
          setTimeout(() => this.access = this.services.auth.getAccess(), 1000);          
        }
        else {
          this.loggedIn = false;
          this.access = 2; 
        }            
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

  account() {
    this.nav.push(AccountPage);
  }

  employee() {
    this.nav.push(EmployeePage);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  login() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }  

  logout() {
    let loader = this.loader.create({ content: "Logging out..."});
    loader.present(); 
    this.afAuth.auth.signOut();
    loader.dismiss();
  }
}
