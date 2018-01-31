import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Movie } from './../../data_structures/movie';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  movies: Observable<Movie[]>;
  desktop: boolean = true;

  constructor(public navCtrl: NavController,
  public db: AngularFireDatabase,
  public loader: LoadingController,
  public platform: Platform) {

    this.movies = db.list<Movie>('/movies', ref => ref.orderByChild('Year').equalTo('2017')).valueChanges();

    if(this.platform.is('core'))
      this.desktop = true;
    else if(this.platform.is('mobileweb') || this.platform.is('android') || this.platform.is('ios') || this.platform.is('mobile'))
      this.desktop = false;
    else 
      this.desktop = true;
  }

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Getting current movies...',
      duration: 1000
    });
    loader.present();

    console.log(this.platform._platforms);
  }
}
