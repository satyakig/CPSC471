import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcctSettingPage } from './acct-setting';

@NgModule({
  declarations: [
    AcctSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(AcctSettingPage),
  ],
})
export class AcctSettingPageModule {}
