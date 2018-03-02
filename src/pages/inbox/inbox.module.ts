import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InboxPage } from './inbox';

import { SharedPipes } from './../../pipes/shared.pipes';

@NgModule({
  declarations: [
    InboxPage,
  ],
  imports: [
    IonicPageModule.forChild(InboxPage),
    SharedPipes
  ],
})
export class InboxPageModule {}
