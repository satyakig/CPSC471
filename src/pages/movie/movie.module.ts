import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MoviePage } from './movie';

import { SharedPipes } from './../../pipes/shared.pipes';

@NgModule({
  declarations: [
    MoviePage,
  ],
  imports: [
    IonicPageModule.forChild(MoviePage),
    SharedPipes
  ],
})
export class MoviePageModule {}
