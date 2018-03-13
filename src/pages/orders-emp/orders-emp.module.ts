import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersEmpPage } from './orders-emp';

@NgModule({
  declarations: [
    OrdersEmpPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdersEmpPage),
  ],
})
export class OrdersEmpPageModule {}
