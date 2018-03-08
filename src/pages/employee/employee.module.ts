import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeePage } from './employee';

import { SharedPipes } from './../../pipes/shared.pipes';

@NgModule({
  declarations: [
    EmployeePage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeePage),
    SharedPipes
  ],
})
export class EmployeePageModule {}
