import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, LoadingController, Platform } from 'ionic-angular';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Movie } from './../../data_structures/movie';
import { MoviePage } from './../movie/movie';
import { Services } from './../../services/services';

@IonicPage()
@Component({
  selector: 'page-current',
  templateUrl: 'current.html',
})
export class CurrentPage {

  movies: Observable<Movie[]>;
  
  locationID: string = "";
  date: string = "";
  desktop: boolean = true;

  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams,
  public loader: LoadingController, public platform: Platform, public services: Services) {

  }

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Getting current movies...',
      duration: 500
    });
    loader.present();

    this.locationID = this.services.theatre.getLocationID();
    this.date = this.services.theatre.getShowDate();
    this.movies = this.db.list<Movie>('locations/' + this.locationID + '/movies', ref => ref.orderByChild('Title')).valueChanges();
    this.desktop = this.platform.is('core');
  }
  
  movieClick(id: string) {
    this.navCtrl.push(MoviePage, {id: id, current: true});
  }

  sort(index: number, fab: FabContainer) {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Sorting movies...',
    });
    fab.close();

    loader.present().then(() => {
      if(index == 1)
        this.movies = this.db.list<Movie>('locations/' + this.locationID + '/movies', ref => ref.orderByChild('imdbRating'))
        .valueChanges().map(array => array.reverse());
      else if(index == 2) 
        this.movies = this.db.list<Movie>('locations/' + this.locationID + '/movies', ref => ref.orderByChild('Released')).valueChanges()
      else if(index == 3) 
        this.movies = this.db.list<Movie>('locations/' + this.locationID + '/movies', ref => ref.orderByChild('Runtime')).valueChanges();
      else if(index == 4)
        this.movies = this.movies.map(array => array.reverse());
      else
        this.movies = this.db.list<Movie>('locations/' + this.locationID + '/movies', ref => ref.orderByChild('Title')).valueChanges();
    }).then(() => loader.dismiss());
  }

}
