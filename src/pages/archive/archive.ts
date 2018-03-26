import { Component } from '@angular/core';
import { IonicPage, ModalController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';

import { Services } from './../../services/services';
import { Ticket } from './../../data_structures/ticket';
import { TicketPage } from './../ticket/ticket';

@IonicPage()
@Component({
  selector: 'page-archive',
  templateUrl: 'archive.html',
})
export class ArchivePage {
  tickets: Observable<Ticket[]>;

  constructor(public services: Services, public modalCtrl: ModalController, public fDb: AngularFireDatabase,
    public loader: LoadingController) { }

  ionViewDidLoad() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Fetching tickets',
    });
    loader.present();
        
    this.tickets =  this.fDb.list<Ticket>('users/' + this.services.auth.getUID() + '/tickets', ref => ref.orderByChild('show/unixDateTime')
    .endAt(this.services.date.getToday())).valueChanges();

    loader.dismiss();
  }

  openTicket(ticket: Ticket) {
    let modal = this.modalCtrl.create(TicketPage, {ticket: ticket});
    modal.present();
  }
}
