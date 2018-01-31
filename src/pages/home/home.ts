import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Movie } from './../../data_structures/movie';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  movies: Observable<Movie[]>;

  constructor(public navCtrl: NavController,
  public db: AngularFireDatabase) {
    this.movies = db.list<Movie>('movies2').valueChanges();
  }
}
