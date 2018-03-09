import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { Services } from './../../services/services';
import { Ticket } from './../../data_structures/ticket';
import { Movie } from './../../data_structures/movie';
import { TrailersPage } from './../trailers/trailers';

@IonicPage()
@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {
  ticket: Ticket = {
    ticketID: "",
    customerEmail: "",
    customerName: "",
    movieName: "",
    movieID: "",
    show: {
      showID: "",
      theatreNum: 0,
      time: "",    
      unixDate: 0,
      unixDateTime: 0
    },
    seats: [],
    quantity: 0,
    price: 0,
    location: {
      address: "",
      name: "",
      locationID: ""
    }
  }

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

  type: string = "";
  code = null;


  constructor(public viewCtrl: ViewController, public services: Services, public modalCtrl: ModalController,
    public navParams: NavParams, public fDb: AngularFireDatabase) { }

  ionViewWillEnter() {
    this.ticket = this.navParams.get('ticket');
    console.log(this.ticket);
    this.type = this.navParams.get('type');
    this.code = JSON.stringify(this.ticket);

    this.fDb.object<Movie>('locations/' + this.ticket.location.locationID + '/movies/' + this.ticket.movieID).valueChanges()
    .subscribe(data => {
      this.movie = data;
    });
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
