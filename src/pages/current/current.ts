import { Component } from '@angular/core';
import { IonicPage, NavParams, LoadingController, Platform } from 'ionic-angular';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Movie } from './../../data_structures/movie';
import { MoviePage } from './../movie/movie';

@IonicPage()
@Component({
  selector: 'page-current',
  templateUrl: 'current.html',
})
export class CurrentPage {

  parentNav: any;

  movies: Observable<Movie[]>;  
  desktop: boolean = true;

  constructor(public db: AngularFireDatabase, public navParams: NavParams,
  public loader: LoadingController, public platform: Platform) {

    this.parentNav = navParams.data;
    this.movies = this.db.list<Movie>('currentMovies', ref => ref.orderByChild('Title')).valueChanges();
  }

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Getting current movies...',
      duration: 750
    });
    loader.present();
    
    this.desktop = this.platform.is('core');
  }
  
  movieClick(id: string) {
    this.parentNav.push(MoviePage, { id: id, current: true });
  }

  sort(index: number, fab: FabContainer) {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Sorting movies...',
    });
    fab.close();

    loader.present().then(() => {
      if(index == 1)
        this.movies = this.db.list<Movie>('currentMovies', ref => ref.orderByChild('imdbRating')).valueChanges();
      else if(index == 2) 
        this.movies = this.db.list<Movie>('currentMovies', ref => ref.orderByChild('Runtime')).valueChanges();
      else if(index == 3)
        this.movies = this.movies.map(array => array.reverse());
      else
        this.movies = this.db.list<Movie>('currentMovies', ref => ref.orderByChild('Title')).valueChanges();
    }).then(() => loader.dismiss());
  }

}
