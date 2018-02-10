import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrentPage } from './current';

import { SharedPipes } from './../../pipes/shared.pipes';

@NgModule({
  declarations: [
    CurrentPage,
  ],
  imports: [
    IonicPageModule.forChild(CurrentPage),
    SharedPipes
  ],
})
export class CurrentPageModule {}
