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
import { UpcomingPageModule } from './../pages/upcoming/upcoming.module';
import { UpcomingPage } from './../pages/upcoming/upcoming';
import { LoginPage } from '../pages/login/login';
import { LoginPageModule } from '../pages/login/login.module';
import { SignupPage } from '../pages/signup/signup';
import { SignupPageModule } from '../pages/signup/signup.module';

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
    HomePageModule,
    UpcomingPageModule,  
    LoginPageModule,
    SignupPageModule  
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    UpcomingPage,
    LoginPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
