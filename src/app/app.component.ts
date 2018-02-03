import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Nav, Platform, LoadingController } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { UpcomingPage } from './../pages/upcoming/upcoming';
import { LoginPage } from './../pages/login/login';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  home() {
    this.nav.popToRoot();
  }

  upcoming() {
    this.nav.push(UpcomingPage);
  }

  login(){
    this.nav.push(LoginPage);
  }
  
}

