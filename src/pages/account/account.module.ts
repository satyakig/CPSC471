import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPage } from './account';
import { InboxPage } from '../inbox/inbox';

@NgModule({
  declarations: [
    AccountPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountPage),
  ],
})
export class AccountPageModule {}
