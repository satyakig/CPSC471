import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, LoadingController, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { Movie } from './../../data_structures/movie';

@IonicPage()
@Component({
  selector: 'page-movie',
  templateUrl: 'movie.html',
})
export class MoviePage {
  movieID: string;
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
    Videos: []    
  }; 

  showVideos: boolean = false;
  videos: any = [];

  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams,
  public loader: LoadingController, public platform: Platform) { } 

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Fetching movie info...',
    });
    loader.present();

    this.movieID = this.navParams.get('id');
    this.current = this.navParams.get('current');
    this.desktop = this.platform.is('core');
    
    if(this.navParams.get('current'))
      this.db.object<Movie>('currentMovies/' + this.movieID).valueChanges().subscribe(data => {
        this.movie = data;

        if(data.Videos == undefined || data.Videos == null || data.Videos == [])
          this.showVideos = false;
        else {
          this.videos = data.Videos;
          this.showVideos = true; 
        }
      });
    else
      this.db.object<Movie>('upcomingMovies/' + this.movieID).valueChanges().subscribe(data => {
        this.movie = data;

        if(data.Videos == undefined || data.Videos == null || data.Videos == [])
          this.showVideos = false;
        else {
          this.videos = data.Videos;
          this.showVideos = true;           
        }
      });

    loader.dismiss();
  }
}
