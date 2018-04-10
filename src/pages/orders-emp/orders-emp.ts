import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Services } from './../../services/services';
import { Location } from './../../data_structures/location';
import { Order } from './../../data_structures/order';


@IonicPage()
@Component({
  selector: 'page-orders-emp',
  templateUrl: 'orders-emp.html',
})
export class OrdersEmpPage {
  locations: Observable<Location[]>;
  orders: Observable<Order[]>;

  showLocations: boolean = true;
  locationID: string = "";
  locationName: string = null;

  constructor(public services: Services,public fDb: AngularFireDatabase, public loaderCtrl: LoadingController) {
    
  }

  ionViewDidLoad() {
    let loader = this.loaderCtrl.create({
      spinner: 'dots',
      content: 'Please wait',
    });
    loader.present();
    this.locations = this.fDb.list<Location>('locations').valueChanges();
    loader.dismiss();
  }

  changeLocation() {
    this.showLocations = true;
  }

  selectLocation(loc: Location) {
    this.showLocations = false;
    this.locationID = loc.locationID;
    this.locationName = loc.name;
    
    this.orders = this.fDb.list<Order>('locations/' + this.locationID + '/orders', ref => ref.orderByChild('status').endAt(1))
    .valueChanges().map(array => array.reverse());
  }

  prepared(order: Order) {
    this.fDb.object('locations/' + order.location.locationID + '/orders/' + order.orderID + '/status').set(2);
  }
}
