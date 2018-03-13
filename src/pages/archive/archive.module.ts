import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArchivePage } from './archive';

import { SharedPipes } from './../../pipes/shared.pipes';

@NgModule({
  declarations: [
    ArchivePage,
  ],
  imports: [
    IonicPageModule.forChild(ArchivePage),
    SharedPipes,
  ],
})
export class ArchivePageModule {}
