import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, LoadingController, Platform } from 'ionic-angular';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

import { Movie } from './../../data_structures/movie';
import { MoviePage } from './../movie/movie';
import { Services } from './../../services/services';

@IonicPage()
@Component({
  selector: 'page-current',
  templateUrl: 'current.html',
})
export class CurrentPage {
  sub: Subscription = null;
  allMovies: Movie[] = [];
  filteredMovies: Movie[] = [];
  
  locationID: string = "";
  date: string = "";
  desktop: boolean = true;

  searchText: string = null;
  showCancel: boolean = true;
  animate: boolean = true;
  correct: boolean = true;
  spell: boolean = true;
  bounce: number = 500;

  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams,
  public loader: LoadingController, public platform: Platform, public services: Services) { }

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Getting current movies',
      duration: 500
    });
    loader.present();

    this.locationID = this.services.theatre.getLocationID();
    this.date = this.services.theatre.getShowDate();
    this.desktop = this.platform.is('core');
    this.sub = this.db.list<Movie>('locations/' + this.locationID + '/movies', ref => ref.orderByChild('Title')).valueChanges().subscribe(data => {
      this.allMovies = data;
      this.filterMovies();
    });
  }
  
  movieClick(id: string) {
    this.navCtrl.push(MoviePage, {id: id, current: true});
  }

  sort(index: number, fab: FabContainer) {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Sorting movies',
    });
    fab.close();

    loader.present().then(() => {
      if(index == 1) {
        this.unsubscribe();
        this.sub = this.db.list<Movie>('locations/' + this.locationID + '/movies', ref => ref.orderByChild('imdbRating')).valueChanges()
        .subscribe(data => {
          this.allMovies = data.reverse();
          this.filterMovies();
        });
      }
      else if(index == 2) {
        this.unsubscribe();
        this.sub = this.db.list<Movie>('locations/' + this.locationID + '/movies', ref => ref.orderByChild('Runtime')).valueChanges()
        .subscribe(data => {
          this.allMovies = data;
          this.filterMovies();
        });
      }
      else if(index == 3)
        this.filteredMovies = this.filteredMovies.reverse();
      else {
        this.unsubscribe();
        this.sub = this.db.list<Movie>('locations/' + this.locationID + '/movies', ref => ref.orderByChild('Title')).valueChanges()
        .subscribe(data => {
          this.allMovies = data;
          this.filterMovies();
        });
      }
    }).then(() => loader.dismiss());
  }

  filterMovies(search?: string) {
    if(search) {
      this.filteredMovies = this.allMovies.filter((movie) => {
        return movie.Title.toLowerCase().indexOf(search.toLowerCase()) > -1;
      });
    }
    else
      this.filteredMovies = this.allMovies;
  }

  onInput(event) {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Sorting movies',
    });
    loader.present();
    this.searchText = this.searchText.trim();
    if(this.searchText != null && this.searchText != "")
      this.filterMovies(this.searchText);
    else
      this.filterMovies();
    loader.dismiss();
  }

  onCancel(event) {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Please wait',
    });
    loader.present();
    this.filterMovies();
    loader.dismiss();
  }

  unsubscribe() {
    if(this.sub != null)
      this.sub.unsubscribe();
  }

  ionViewWillUnload() {
    this.unsubscribe();
  }
}
