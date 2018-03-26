import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Nav, Platform, ModalController, LoadingController, AlertController } from 'ionic-angular';
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
    public splashScreen: SplashScreen, public modalCtrl: ModalController, public services: Services, 
    public loader: LoadingController, public alertCtrl: AlertController) {

    platform.ready().then(() => {
      statusBar.styleLightContent();
      splashScreen.hide();
      
      afAuth.authState.subscribe((auth) => {
        if(auth) {
          this.refreshAccess();
          this.loggedIn = true;
        }
        else {
          this.loggedIn = false;
          this.refreshAccess();
        }
      });
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
    let access = this.services.auth.getAccess();
    if(access == 1 || access == 0)
      this.nav.push(EmployeePage);
    else
      this.showAlert('Invalid User', "You don't have access to view this page.");
  }

  refreshAccess() {
    this.access = this.services.auth.getAccess();
  }

  login() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
    modal.onDidDismiss(() => {
      this.refreshAccess();
    });
  }  

  logout() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Logging out',
    });
    loader.present(); 
    this.afAuth.auth.signOut().then(() => {
      this.refreshAccess();
    });
    loader.dismiss();
  }

  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
