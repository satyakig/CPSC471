import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { InboxPage } from '../inbox/inbox';
import { TicketsPage } from '../tickets/tickets';
import { AcctSettingPage } from '../acct-setting/acct-setting';
import { ArchivePage } from '../archive/archive';


@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  inbox = InboxPage;
  tickets = TicketsPage;
  archive = ArchivePage;
  acctsetting = AcctSettingPage;

  constructor(public navCtrl: NavController, public fAuth: AngularFireAuth) 
  { 
    this.fAuth.authState.subscribe((auth) => {
      if(!auth) {
        if(this.navCtrl.getActive().instance instanceof AccountPage) {
          this.navCtrl.popToRoot();
        }
      }
    });
  }
}
