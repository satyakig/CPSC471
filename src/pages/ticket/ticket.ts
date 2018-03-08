import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ModalController } from 'ionic-angular';

import { Services } from './../../services/services';
import { Ticket } from './../../data_structures/ticket';
import { MoviePage } from './../movie/movie';

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
    movieID: "",
    movieName: "",
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
  type: string = "";
  code = null

  constructor(public viewCtrl: ViewController, public services: Services, public modal: ModalController,
    public navParams: NavParams) { }

  ionViewWillEnter() {
    this.ticket = this.navParams.get('ticket');
    this.type = this.navParams.get('type');
    this.code = JSON.stringify(this.ticket);
  }

  viewDetails() {
    let modal = this.modal.create(MoviePage, {id: this.ticket.movieID, current: true, type: 'modal'});
    modal.present();
  }

  swiped(event) {
    this.viewCtrl.dismiss();
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
