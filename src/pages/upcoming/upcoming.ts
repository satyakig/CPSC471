import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Movie } from './../../data_structures/movie';

@IonicPage()
@Component({
  selector: 'page-upcoming',
  templateUrl: 'upcoming.html',
})
export class UpcomingPage {

  movies: Observable<Movie[]>;
  desktop: boolean = true;

  constructor(public navCtrl: NavController,
  public db: AngularFireDatabase,
  public loader: LoadingController,
  public platform: Platform) {

    this.movies = db.list<Movie>('upcomingMovies').valueChanges();

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
      content: 'Getting upcoming movies...',
      duration: 200
    });
    loader.present();
  }

}
