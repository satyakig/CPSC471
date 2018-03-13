import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { TicketScanPage } from './../ticket-scan/ticket-scan';
import { OrdersEmpPage } from './../orders-emp/orders-emp';

@IonicPage()
@Component({
  selector: 'page-employee',
  templateUrl: 'employee.html',
})
export class EmployeePage {
  scan = TicketScanPage;
  orders = OrdersEmpPage;

  constructor(public navCtrl: NavController, public fAuth: AngularFireAuth) {
    this.fAuth.authState.subscribe((auth) => {
      if(!auth) {
        if(this.navCtrl.getActive().instance instanceof EmployeePage) {
          this.navCtrl.popToRoot();
        }
      }
    });
  }
}
