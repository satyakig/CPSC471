import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketPage } from './ticket';

import { NgxQRCodeModule } from 'ngx-qrcode2';
import { SharedPipes } from './../../pipes/shared.pipes';

@NgModule({
  declarations: [
    TicketPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketPage),
    NgxQRCodeModule,
    SharedPipes
  ],
})
export class TicketPageModule {}
