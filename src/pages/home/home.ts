import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, ToastController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController,
  public db: AngularFireDatabase,
  public loader: LoadingController,
  public platform: Platform) {

    this.movies = db.list<Movie>('currentMovies', ref => ref.orderByChild('Title')).valueChanges();

  }

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Getting current movies...',
      duration: 1500
    });
    loader.present();
  }
  
}
