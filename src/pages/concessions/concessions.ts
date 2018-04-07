import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

import { Item } from './../../data_structures/item';
import { Ticket } from './../../data_structures/ticket';
import { Services } from './../../services/services';

@IonicPage()
@Component({
  selector: 'page-concessions',
  templateUrl: 'concessions.html',
})
export class ConcessionsPage {
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
  items: Item[] = [];
  total: number = 0;
  sub: Subscription = null;
  card: string = "";

  constructor(public navParams: NavParams, public viewCtrl: ViewController, public loadingCtrl: LoadingController,
    public services: Services, public fDb: AngularFireDatabase, public alertCtrl: AlertController) {
      setInterval(() => {
        this.total = this.updateTotal()
    }, 500);
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Fetching movie info',
    });
    loader.present();
    this.ticket = this.navParams.get('ticket');
    this.card = this.services.auth.getCard();
    this.sub = this.fDb.list<Item>('locations/' + this.ticket.location.locationID + '/items').valueChanges()
    .subscribe(data => {
      this.items = [];
      data.forEach(item => {
        this.items.push({
          name: item.name,
          price: item.price,
          quantity: 0
        });
      });
    })
    loader.dismiss();
  }

  addItem(item: Item, index: number) {
    this.items[index].quantity++;
  }

  removeItem(item: Item, index: number) {
    if(this.items[index].quantity > 0)
      this.items[index].quantity--;
  }

  updateTotal(): number {
    let price = 0;
    for(let item of this.items) {
      if(item.quantity > 0) {
        price += (item.quantity * item.price);
      }
    }
    return price;
  }

  checkout() {
    try {
      let order = {
        orderID: null,
        ticketID: this.ticket.ticketID,
        orderedOn: this.services.date.getCurrentUnixSec(),
        customerEmail: this.services.auth.getEmail(),
        customerName: this.services.auth.getName(),
        status: 0,
        items: null,
        totalPrice: 0,
        location: this.ticket.location
      }
      this.services.theatre.orderConcessions(order, this.items);
      this.viewCtrl.dismiss();
    }
    catch(err) {
      this.showAlert("Error", err.message);
    }    
  }

  validOrder() {
    for(let item of this.items) {
      if(item.quantity > 0)
        return true;
    }
    return false;
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

  swiped(event) {
    this.viewCtrl.dismiss();
  }

  close() {
    this.viewCtrl.dismiss();
  }

  ionViewWillLeave() {
    if(this.sub != null)
      this.sub.unsubscribe();
  }
}
