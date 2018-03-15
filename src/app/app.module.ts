import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { Device } from '@ionic-native/device';

import { Firebase_Config } from './environments';
import { MyApp } from './app.component';
import { HomePageModule } from '../pages/home/home.module';
import { HomePage } from '../pages/home/home';
import { CurrentPageModule } from './../pages/current/current.module';
import { CurrentPage } from './../pages/current/current';
import { UpcomingPageModule } from './../pages/upcoming/upcoming.module';
import { UpcomingPage } from './../pages/upcoming/upcoming';
import { LoginPage } from '../pages/login/login';
import { LoginPageModule } from '../pages/login/login.module';
import { MoviePage } from '../pages/movie/movie';
import { MoviePageModule } from '../pages/movie/movie.module';
import { TrailersPage } from '../pages/trailers/trailers';
import { TrailersPageModule } from '../pages/trailers/trailers.module';
import { AccountPage } from '../pages/account/account';
import { AccountPageModule } from '../pages/account/account.module';
import { InboxPageModule } from '../pages/inbox/inbox.module';
import { InboxPage } from '../pages/inbox/inbox';
import { TicketsPage } from '../pages/tickets/tickets';
import { TicketsPageModule } from '../pages/tickets/tickets.module';
import { ArchivePage } from '../pages/archive/archive';
import { ArchivePageModule } from '../pages/archive/archive.module';
import { AcctSettingPageModule } from '../pages/acct-setting/acct-setting.module';
import { AcctSettingPage } from '../pages/acct-setting/acct-setting';
import { CheckoutPageModule } from '../pages/checkout/checkout.module';
import { CheckoutPage } from '../pages/checkout/checkout';
import { TicketPage } from '../pages/ticket/ticket';
import { TicketPageModule } from '../pages/ticket/ticket.module';
import { EmployeePage } from '../pages/employee/employee';
import { EmployeePageModule } from '../pages/employee/employee.module';
import { TicketScanPage } from '../pages/ticket-scan/ticket-scan';
import { TicketScanPageModule } from '../pages/ticket-scan/ticket-scan.module';
import { OrdersEmpPage } from '../pages/orders-emp/orders-emp';
import { OrdersEmpPageModule } from '../pages/orders-emp/orders-emp.module';
import { ConcessionsPage } from '../pages/concessions/concessions';
import { ConcessionsPageModule } from '../pages/concessions/concessions.module';

import { SharedPipes } from './../pipes/shared.pipes';
import { Services } from './../services/services';
import { AuthService } from './../services/authService';
import { DateService } from './../services/dateService';
import { TheatreService } from './../services/theatreService';



@NgModule({
  declarations: [
    MyApp,    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(Firebase_Config),
    AngularFireDatabaseModule, 
    AngularFireAuthModule,
    HttpModule,
    SharedPipes.forRoot(),
    HomePageModule,
    CurrentPageModule,
    UpcomingPageModule,  
    LoginPageModule,
    MoviePageModule,
    TrailersPageModule,
    AccountPageModule,
    InboxPageModule,
    TicketsPageModule,
    ArchivePageModule,
    AcctSettingPageModule,
    CheckoutPageModule,
    TicketPageModule,
    EmployeePageModule,
    TicketScanPageModule,
    OrdersEmpPageModule,
    ConcessionsPageModule,
    NgxQRCodeModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CurrentPage,
    UpcomingPage,
    LoginPage,
    MoviePage,
    TrailersPage,
    AccountPage,
    InboxPage,
    TicketsPage,
    ArchivePage,
    AcctSettingPage,
    CheckoutPage,
    TicketPage,
    EmployeePage,
    TicketScanPage,
    OrdersEmpPage,
    ConcessionsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    Services,
    AuthService,
    TheatreService,
    DateService,
    Device,
  ]
})
export class AppModule {}
