import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketScanPage } from './ticket-scan';

import { SharedPipes } from './../../pipes/shared.pipes';
@NgModule({
  declarations: [
    TicketScanPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketScanPage),
    SharedPipes,
  ],
})
export class TicketScanPageModule {}
