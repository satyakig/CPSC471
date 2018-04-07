import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { Services } from './../../services/services';
import { Seat } from './../../data_structures/seat';
import { Show } from './../../data_structures/show';
import { Theatre } from './../../data_structures/theatre';

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  loggedIn: boolean = false;
  name: string = "";
  card: string = "";
  
  movieTitle: string = "";
  movieRuntime: number = 0;

  location = {
    address: "",
    locationID: "",
    name: ""
  }

  show: Show = {
    showID: "",
    time: "",
    theatreNum: -1,
    type: "",
    price: 0,
    unixDate: 0,
    unixDateTime: 0
  }

  selectedSeats: Seat[] = [];
  reservedSeats: Seat[] = [];
  rows = [];
  cols = [];

  constructor(public fDb: AngularFireDatabase, public fAuth: AngularFireAuth, public navCtrl: NavController, public modalCtrl: ModalController, 
    public loader: LoadingController, public alertCtrl: AlertController, public services: Services) {

    this.fAuth.authState.subscribe((auth) => {
      if(auth)
        this.loggedIn = true;
      else {
        this.loggedIn = false;
        if(this.navCtrl.getActive().instance instanceof CheckoutPage) {
          this.navCtrl.pop();
          this.showAlert('Error', 'You must be logged in to view this page!');
        }
      }
    });
  }

  ionViewWillEnter() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Please wait',
    });
    loader.present();

    this.name = this.services.auth.getName();
    this.card = this.services.auth.getCard();
    this.movieTitle = this.services.theatre.getMovieTitle();
    this.movieRuntime = this.services.theatre.getMovieRuntime();
    this.location = this.services.theatre.getLocation();

    this.selectedSeats = this.services.theatre.getSeats();
    this.show = this.services.theatre.getShow();
    this.services.theatre.clearSeats();

    this.fDb.object<Theatre>('locations/' + this.location.locationID + '/theatres/' + this.show.theatreNum).valueChanges()
    .subscribe(data => {
      for(let i = 0; i < data.totalRows; i++)
        this.rows.push(i);
      for(let i = 0; i < data.totalCols; i++)
        this.cols.push(i);
    });

    this.fDb.list<Seat>('locations/' + this.location.locationID + '/bookedSeats/' + this.show.unixDate + '/' + this.show.showID)
    .valueChanges().subscribe(list => {
      this.reservedSeats = [];
      list.forEach(item => {
        this.reservedSeats.push({row: item.row, col: item.col});
        this.removeSeat(item.row, item.col);
      });
    });

    loader.dismiss();
  }

  removeSeat(row: number, col: number) {
    this.selectedSeats = this.services.theatre.removeSeat(row, col);
  }

  clickSeat(row: number, col: number) {
    this.selectedSeats = this.services.theatre.selectSeat(row, col);
  }

  isSeatTaken(row: number, col: number) {
    for(let seat of this.reservedSeats) {
      if(seat.row == row && seat.col == col)
        return true;
    }
    return false;
  }

  isSeatSelected(row: number, col: number) {
    for(let seat of this.selectedSeats) {
      if(seat.row == row && seat.col == col)
        return true;
    }
    return false;
  }

  calculateTotal() {
    return this.show.price * this.selectedSeats.length;
  }

  checkout() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Ordering ticket',
    });
    loader.present();

    if(this.services.theatre.isValid() && this.services.theatre.getSeats().length > 0) {
      this.services.theatre.orderNewTicket().subscribe(
        data => {
          this.services.theatre.clearLocation();
          this.services.theatre.clearSeats();
          this.services.theatre.clearShow();
          this.navCtrl.popToRoot();
          loader.dismiss();
        },
        err => {
          this.showAlert("Error", err.text());
          loader.dismiss();
        }
      );
    }
    else {
      this.showAlert("Error", "Something went wrong.");
      loader.dismiss();
    }
  }

  showAlert(title: string, message: string) {
    if(title == "Error") {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: message,
        buttons: ['OK'],
        cssClass: 'alertError'
      });
      alert.present();
    }
    else {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: message,
        buttons: ['OK'],
      });
      alert.present();
    }    
  }
}
