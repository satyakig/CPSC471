import { Component } from '@angular/core';
import { IonicPage, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AngularFireDatabase } from 'angularfire2/database';

import { Services } from './../../services/services';
import { TicketPage } from './../ticket/ticket';

@IonicPage()
@Component({
  selector: 'page-employee',
  templateUrl: 'employee.html',
})
export class EmployeePage {

  constructor(public services: Services, public modalCtrl: ModalController, public fDb: AngularFireDatabase, 
    public barcode: BarcodeScanner, public alertCtrl: AlertController, public loaderCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loader = this.loaderCtrl.create({
      spinner: 'dots',
      content: 'Please wait...',
    });
    loader.present();

    loader.dismiss();
  }

  scanTicket() {
   this.barcode.scan().then(barcodeData => {
      let ticket = JSON.parse(barcodeData.text);
      let modal = this.modalCtrl.create(TicketPage, {ticket: ticket, type: 'emp'});
      modal.present();
    }).catch(err => {
      this.showAlert('Error', err.message);
    });
  }

  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
