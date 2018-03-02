import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TheatrePage } from './theatre';

import { SharedPipes } from './../../pipes/shared.pipes';


@NgModule({
  declarations: [
    TheatrePage,
  ],
  imports: [
    IonicPageModule.forChild(TheatrePage),
    SharedPipes
  ],
})
export class TheatrePageModule {}
