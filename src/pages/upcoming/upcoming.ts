import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform } from 'ionic-angular';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Movie } from './../../data_structures/movie';
import { MoviePage } from './../movie/movie';

@IonicPage()
@Component({
  selector: 'page-upcoming',
  templateUrl: 'upcoming.html',
})
export class UpcomingPage {
  
  movies: Observable<Movie[]>;
  desktop: boolean = false;

  constructor(public db: AngularFireDatabase, public navCtrl: NavController,
    public loader: LoadingController, public platform: Platform) {

    this.movies = this.db.list<Movie>('upcomingMovies', ref => ref.orderByChild('Title')).valueChanges();
  }

  ionViewDidLoad() {   
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Getting upcoming movies...',
      duration: 1000
    });
    loader.present();

    this.desktop = this.platform.is('core');
  }
  
  movieClick(id: string) {
    this.navCtrl.push(MoviePage, { id: id, current: false, type: 'page' });
  }

  sort(index: number, fab: FabContainer) {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Sorting movies...',
    });

    fab.close();
    
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
