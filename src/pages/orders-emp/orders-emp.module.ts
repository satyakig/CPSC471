import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersEmpPage } from './orders-emp';

import { SharedPipes } from './../../pipes/shared.pipes';

@NgModule({
  declarations: [
    OrdersEmpPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdersEmpPage),
    SharedPipes
  ],
})
export class OrdersEmpPageModule {}
