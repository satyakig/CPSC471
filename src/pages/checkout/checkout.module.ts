import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckoutPage } from './checkout';

import { SharedPipes } from './../../pipes/shared.pipes';


@NgModule({
  declarations: [
    CheckoutPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckoutPage),
    SharedPipes
  ],
})
export class CheckoutPageModule {}
