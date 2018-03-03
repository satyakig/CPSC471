import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { InboxPage } from '../inbox/inbox';
import { TicketsPage } from '../tickets/tickets';
import { AcctSettingPage } from '../acct-setting/acct-setting';
import { TransactionsPage } from '../transactions/transactions';


@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  navs = this.navCtrl;

  inbox = InboxPage;
  tickets = TicketsPage;
  acctsetting = AcctSettingPage;
  transaction = TransactionsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController) 
  { }

  close() {
    this.viewCtrl.dismiss();
  }
}
