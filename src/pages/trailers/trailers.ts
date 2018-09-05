import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-trailers',
  templateUrl: 'trailers.html',
})
export class TrailersPage {

  desktop: boolean = true;
  videos = [];
  title = "";

  constructor(public navParams: NavParams, public viewCtrl: ViewController, public loader: LoadingController) { }

  ionViewWillEnter() {
    let loader = this.loader.create({
      spinner: 'dots',
      content: 'Fetching trailers',
      duration: 1000
    });
    loader.present();
    this.videos = this.navParams.get('videos');
    this.title = this.navParams.get('title');
  }

  swiped(event) {
    this.viewCtrl.dismiss();
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
