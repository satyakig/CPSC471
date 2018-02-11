import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { CurrentPage } from './../current/current';
import { UpcomingPage } from './../upcoming/upcoming';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  navs = this.navCtrl;

  currentPage = CurrentPage;
  upcomingPage = UpcomingPage;

  constructor(public navCtrl: NavController,
  public db: AngularFireDatabase,
  public loader: LoadingController,
  public platform: Platform) {

  }
  
}
