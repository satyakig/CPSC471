import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConcessionsPage } from './concessions';

import { SharedPipes } from './../../pipes/shared.pipes';

@NgModule({
  declarations: [
    ConcessionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ConcessionsPage),
    SharedPipes,
  ],
})
export class ConcessionsPageModule {}
