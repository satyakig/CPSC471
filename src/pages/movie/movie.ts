import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, LoadingController, Platform, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { Movie } from './../../data_structures/movie';
import { Services } from './../../services/services';
import { TrailersPage } from './../trailers/trailers';
import { TheatrePage } from './../theatre/theatre';

@IonicPage()
@Component({
  selector: 'page-movie',
  templateUrl: 'movie.html',
})
export class MoviePage {
  movieID: string = "";
  locationID: string = "";
  current: boolean = true;
  desktop: boolean = true;

  movie: Movie = {
    imdbID: '',
    Title: '',
    Year: '',
    Released: 0,
    Runtime: 0,
    Rated: '',
    Genre: '',
    Director: '',
    Writer: '',
    Actors: '',
    Plot: '',
    Awards: 'N/A',
    BoxOffice: 'N/A',
    Production: 'N/A',
    Website: 'N/A',
    Language: '',
    Country: '',
    Ratings: [],
    Metascore: '',
    imdbRating: '',
    imdbVotes: '',
    Type: '',
    DVD: '',
    Response: '',
    Poster: '',
    Videos: [],
    Showtimes: []    
  }; 

  showVideos: boolean = false;

  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams,
  public loader: LoadingController, public platform: Platform, public modalCtrl: ModalController, public services: Services) { } 

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Fetching movie info...',
    });
    loader.present();

    this.movieID = this.navParams.get('id');
    this.current = this.navParams.get('current');
    this.desktop = this.platform.is('core');
    this.locationID = this.services.theatre.getLocationID();
    
    if(this.navParams.get('current'))
      this.db.object<Movie>('locations/' + this.locationID + '/movies/' + this.movieID).valueChanges().subscribe(data => {
        this.movie = data;
        this.services.theatre.setMovie(this.movie);

        if(data.Videos == undefined || data.Videos == null || data.Videos == [])
          this.showVideos = false;
        else
          this.showVideos = true; 
      });
    else
      this.db.object<Movie>('upcomingMovies/' + this.movieID).valueChanges().subscribe(data => {
        this.movie = data;

        if(data.Videos == undefined || data.Videos == null || data.Videos == [])
          this.showVideos = false;
        else 
          this.showVideos = true;        
      });

    loader.dismiss();
  }

  timeSelected(value: any) {
    this.services.theatre.setShow(value.time, value.theatreNum);
    let modal = this.modalCtrl.create(TheatrePage);
    modal.present();
  }

  showTrailers() {
    let modal = this.modalCtrl.create(TrailersPage, {videos: this.movie.Videos, title: this.movie.Title});
    modal.present();   
  }
}
