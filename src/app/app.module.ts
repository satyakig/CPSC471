import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';


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
import { AccountPage } from '../pages/account/account';
import { AccountPageModule } from '../pages/account/account.module';
import { InboxPageModule } from '../pages/inbox/inbox.module';
import { InboxPage } from '../pages/inbox/inbox';
import { TicketsPage } from '../pages/tickets/tickets';
import { TicketsPageModule } from '../pages/tickets/tickets.module';
import { TransactionsPage } from '../pages/transactions/transactions';
import { TransactionsPageModule } from '../pages/transactions/transactions.module';
import { AcctSettingPageModule } from '../pages/acct-setting/acct-setting.module';
import { AcctSettingPage } from '../pages/acct-setting/acct-setting';


import { SharedPipes } from './../pipes/shared.pipes';



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
    SharedPipes.forRoot(),
    HomePageModule,
    CurrentPageModule,
    UpcomingPageModule,  
    LoginPageModule,
    MoviePageModule,
    AccountPageModule,
    InboxPageModule,
    TicketsPageModule,
    TransactionsPageModule,
    AcctSettingPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CurrentPage,
    UpcomingPage,
    LoginPage,
    MoviePage,
    AccountPage,
    InboxPage,
    TicketsPage,
    TransactionsPage,
    AcctSettingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
