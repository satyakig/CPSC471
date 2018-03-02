import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrailersPage } from './trailers';

import { SharedPipes } from './../../pipes/shared.pipes';

@NgModule({
  declarations: [
    TrailersPage,
  ],
  imports: [
    IonicPageModule.forChild(TrailersPage),
    SharedPipes
  ],
})
export class TrailersPageModule {}
