import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, LoadingController, Platform, ModalController, AlertController, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

import { Movie } from './../../data_structures/movie';
import { Services } from './../../services/services';
import { TrailersPage } from './../trailers/trailers';
import { CheckoutPage } from './../checkout/checkout';
import { LoginPage } from './../login/login';
import { Show } from '../../data_structures/show';

@IonicPage()
@Component({
  selector: 'page-movie',
  templateUrl: 'movie.html',
})
export class MoviePage {
  sub1: Subscription = null;
  sub2: Subscription = null;
  sub3: Subscription = null;

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
    Shows: []    
  }; 

  showVideos: boolean = false;
  now: number = 0;

  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, 
    public alertCtrl: AlertController, public loader: LoadingController, public platform: Platform, 
    public modalCtrl: ModalController, public services: Services, public viewCtrl: ViewController) { } 

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Fetching movie info',
    });
    loader.present();

    this.movieID = this.navParams.get('id');
    this.current = this.navParams.get('current');
    this.desktop = this.platform.is('core');
    this.locationID = this.services.theatre.getLocationID();
    
    if(this.navParams.get('current'))
      this.sub1 = this.db.object<Movie>('locations/' + this.locationID + '/movies/' + this.movieID).valueChanges().subscribe(data => {
        this.movie = data;
        this.services.theatre.setMovie(this.movie);

        if(data.Videos == undefined || data.Videos == null || data.Videos == [])
          this.showVideos = false;
        else
          this.showVideos = true; 
      });
    else
      this.sub2 = this.db.object<Movie>('upcomingMovies/' + this.movieID).valueChanges().subscribe(data => {
        this.movie = data;

        if(data.Videos == undefined || data.Videos == null || data.Videos == [])
          this.showVideos = false;
        else 
          this.showVideos = true;        
      });

    this.sub3 = this.services.date.get24HrTimeSub().subscribe(data => {
      this.now = Number(data);
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

      let alert = this.alertCtrl.create({
        title: "Oops!",
        subTitle: "You must be logged in to proceed.",
        buttons: ['OK'],
        cssClass: 'alertError'
      });
      alert.present();

      modal.onDidDismiss(() => {
        if(this.services.auth.isLoggedIn())
          this.showSelected(show);
      });
    }      
  }

  isShowValid(show: Show) {
    let showtime = Number(show.time);
    if(this.services.theatre.getShowDateUnix() > this.services.date.getCurrentUnixSec())
      return true;
    else
      return showtime > this.now;
  }

  showTrailers() {
    let modal = this.modalCtrl.create(TrailersPage, {videos: this.movie.Videos, title: this.movie.Title});
    modal.present();   
  }

  ionViewWillUnload() {
    if(this.sub1 != null)
      this.sub1.unsubscribe();
    if(this.sub2 != null)
      this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }
}
