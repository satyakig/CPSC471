import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

import { Services } from './../../services/services';
import { Ticket } from './../../data_structures/ticket';
import { Order } from './../../data_structures/order';
import { Movie } from './../../data_structures/movie';
import { TrailersPage } from './../trailers/trailers';
import { ConcessionsPage } from './../concessions/concessions';

@IonicPage()
@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {
  sub1: Subscription = null;
  sub2: Subscription = null;

  orders: Order[] = [];

  ticket: Ticket = {
    ticketID: "",
    orderedOn: 0,
    customerEmail: "",
    customerName: "",
    movieName: "",
    movieID: "",
    show: {
      showID: "",
      theatreNum: 0,
      time: "",    
      type: "",
      price: 0,
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

  code = null;
  viewQR: boolean = false;
  viewMovie: boolean = false;
  showStarted: boolean = false;
  canOrder: boolean = false;

  constructor(public viewCtrl: ViewController, public services: Services, public modalCtrl: ModalController,
    public navParams: NavParams, public fDb: AngularFireDatabase, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) { }

  ionViewWillEnter() {
    this.ticket = this.navParams.get('ticket');
    this.code = JSON.stringify(this.ticket);

    this.fDb.object<Movie>('locations/' + this.ticket.location.locationID + '/movies/' + this.ticket.movieID).valueChanges()
    .subscribe(data => {
      this.movie = data;
    });

    this.sub1 = this.fDb.list<Order>('users/' + this.services.auth.getUID() + '/orders',
      ref => ref.orderByChild('ticketID').equalTo(this.ticket.ticketID)).valueChanges().subscribe(data => {
        this.orders = data;
    });
    
    this.sub2 = this.services.date.getCurrentTimeSub().subscribe(data => {
      this.showStarted = Number(data) >= this.ticket.show.unixDateTime;

      let cond1 = Number(data) < ((this.movie.Runtime * 60) + this.ticket.show.unixDateTime);
      let cond2 = this.services.date.getToday() == this.ticket.show.unixDate;
      this.canOrder = cond1 && cond2;
    });

  }

  refund() {
    
  }

  prepare(order: Order) {
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Notifying theatre...',
    });
    loader.present();

    this.services.theatre.prepareConcessions(order).subscribe(
      data => {
        loader.dismiss();
      },
      err => {
        this.showAlert("Error", err.text());
        loader.dismiss();
      }
    );
  }

  addConcessions() {
    let modal = this.modalCtrl.create(ConcessionsPage, {ticket: this.ticket});
    modal.present();
  }

  viewDetails(value: boolean) {
    this.viewMovie = value;
  }

  viewCode(value: boolean) {
    this.viewQR = value;
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

  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewWillLeave() {
    if(this.sub1 != null)
      this.sub1.unsubscribe();
    if(this.sub2 != null)
      this.sub2.unsubscribe();
  }
}
