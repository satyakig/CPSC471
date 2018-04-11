import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
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
  locations: Observable<Location[]>;

  date: string = "";
  dates: string[] = [];
  selectOptions = {
    title: 'Choose a date',
  };

  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public services: Services) {
    this.locations = this.db.list<Location>('locations').valueChanges();

    var today = moment();
    this.date = today.format('dddd, MMM DD');
    for(let i = 0; i < 7; i++, today.add(1, "day")) {
      this.dates.push(today.format('dddd, MMM DD'));
    }
  }

  ionViewDidLoad() {
    this.services.theatre.setShowDate(this.date);
  }

  changeDate() {
    this.services.theatre.setShowDate(this.date);
  }
  
  locationSelect(location: any) {
    this.services.theatre.setShowDate(this.date);
    this.services.theatre.setLocation(location);
    this.navCtrl.push(CurrentPage);
  }
}
