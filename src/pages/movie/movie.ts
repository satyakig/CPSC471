import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, LoadingController, Platform, ModalController, AlertController, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { Movie } from './../../data_structures/movie';
import { Services } from './../../services/services';
import { TrailersPage } from './../trailers/trailers';
import { CheckoutPage } from './../checkout/checkout';
import { LoginPage } from './../login/login';

@IonicPage()
@Component({
  selector: 'page-movie',
  templateUrl: 'movie.html',
})
export class MoviePage {
  movieID: string = "";
  type: string = "";

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
    Shows: []    
  }; 

  showVideos: boolean = false;

  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, 
    public alertCtrl: AlertController, public loader: LoadingController, public platform: Platform, 
    public modalCtrl: ModalController, public services: Services, public viewCtrl: ViewController) { } 

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Fetching movie info...',
    });
    loader.present();

    this.movieID = this.navParams.get('id');
    this.current = this.navParams.get('current');
    this.type = this.navParams.get('type');    
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

  showSelected(show: any) {
    this.services.theatre.setShow(show);

    if(this.services.auth.isLoggedIn()) {
      if(this.services.theatre.isValid()) 
        this.navCtrl.push(CheckoutPage);
      else {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Something went wrong. Invalid data saved.',
          buttons: ['OK']
        });
        alert.present();
      }
    }    
    else {
      let modal = this.modalCtrl.create(LoginPage);
      modal.present();
      modal.onDidDismiss(() => {
        if(this.services.auth.isLoggedIn())
          this.showSelected(show);
      });
    }      
  }

  showTrailers() {
    let modal = this.modalCtrl.create(TrailersPage, {videos: this.movie.Videos, title: this.movie.Title});
    modal.present();   
  }

  swiped(event) {
    this.viewCtrl.dismiss();
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
