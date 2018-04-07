import { Component } from '@angular/core';
import { IonicPage, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Device } from '@ionic-native/device';

import { Services } from './../../services/services';
import { Ticket } from './../../data_structures/ticket';
import { Order } from './../../data_structures/order';

@IonicPage()
@Component({
  selector: 'page-ticket-scan',
  templateUrl: 'ticket-scan.html',
})
export class TicketScanPage {
  ticket: Ticket = null;
  orders: Observable<Order[]>;

  showOrders: boolean = false;
  
  constructor(public services: Services,public fDb: AngularFireDatabase, public barcode: BarcodeScanner,
    public alertCtrl: AlertController, public device: Device) { }

  scanTicket() {
    if(this.device.platform == "browser")
      this.showAlert("Error", "You need to use the Android or iOS app to scan a ticket.")
    else {
      this.barcode.scan().then(barcodeData => {
        this.ticket = JSON.parse(barcodeData.text);
        this.orders = this.fDb.list<Order>('locations/' + this.ticket.location.locationID + '/orders',
        ref => ref.orderByChild('ticketID').equalTo(this.ticket.ticketID)).valueChanges();
  
        this.showOrders = true;
      }).catch(err => {
        this.ticket = null;
        this.showOrders = false;
      });
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
