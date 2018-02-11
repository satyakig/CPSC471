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
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CurrentPage,
    UpcomingPage,
    LoginPage,
    MoviePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
