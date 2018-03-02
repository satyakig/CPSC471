import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { Location } from './../../data_structures/location';
import { CurrentPage } from './../current/current';
import { Services } from './../../services/services';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  date: string = "";
  dates: string[] = [];
  selectOptions = {
    title: 'Choose a date',
  };

  locations: Observable<Location[]>;
  
  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public loader: LoadingController,
  public platform: Platform, public services: Services) {

    this.locations = this.db.list<Location>('locations').valueChanges();

    var today = moment();
    this.date = today.format('dddd, MMM DD');
    for(let i = 0; i < 7; i++, today.add(1, "day")) {
      this.dates.push(today.format('dddd, MMM DD'));
    }  
  }

  changeDate() {
    this.services.date.setSelectedDate(this.date);
  }
  
  locationSelect(location: any) {
    this.services.theatre.setLocation(location);
    this.navCtrl.push(CurrentPage);
  }  
}
