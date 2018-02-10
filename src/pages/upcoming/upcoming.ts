import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, ToastController } from 'ionic-angular';
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
  desktop: boolean = false;

  constructor(public navCtrl: NavController, public db: AngularFireDatabase,
  public loader: LoadingController, public platform: Platform) {
    this.movies = db.list<Movie>('upcomingMovies', ref => ref.orderByChild('Title')).valueChanges();
  }

  ionViewDidLoad() {   
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Getting upcoming movies...',
      duration: 500
    });
    loader.present();

    this.desktop = this.platform.is('core');
  }
  
  movieClick(id: string) {
    console.log(id);
  }

  sort(index: number) {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Sorting movies...',
    });

    loader.present().then(() => {
      if(index == 1)
        this.movies = this.db.list<Movie>('upcomingMovies', ref => ref.orderByChild('Released')).valueChanges();
      else if(index == 2)
        this.movies = this.movies.map(array => array.reverse());
      else
        this.movies = this.db.list<Movie>('upcomingMovies', ref => ref.orderByChild('Title')).valueChanges();
    }).then(() => loader.dismiss());
  }

}
