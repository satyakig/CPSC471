import { Component } from '@angular/core';
import { IonicPage, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';

import { Services } from './../../services/services';
import { User } from '../../data_structures/user';

@IonicPage()
@Component({
  selector: 'page-acct-setting',
  templateUrl: 'acct-setting.html',
})
export class AcctSettingPage {
  name: string = "";
  email: string = "";
  card: string = "";

  sub: Subscription = null;

  constructor(private fAuth: AngularFireAuth, private fDb: AngularFireDatabase, private alertCtrl: AlertController,
    private services: Services) { }

  ionViewWillEnter() {
    this.sub = this.fDb.object<User>('users/' + this.services.auth.getUID()).valueChanges().subscribe(data => {
      this.name = data.name;
      this.email = data.email;
      this.card = data.card;
    });
  }

  changeName() {
    let alert = this.alertCtrl.create({
      title: 'Please enter your name',
      inputs: [
        {
          name: 'name',
          placeholder: this.name,
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: data => {
            if(data.name == null || data.name.length < 1 || data.name == undefined || data.name == true || data.name == false)
              this.showAlert("Error", "Invalid input");                  
            else {
              this.fDb.object('users/' + this.services.auth.getUID() + '/name').set(String(data.name))
              .catch(err => {
                this.showAlert("Error", err.message);
              });
            }                       
          }
        }
      ]
    });
    alert.present();
  }

  changeEmail() {
    let alert = this.alertCtrl.create({
      title: 'Please enter your email',
      inputs: [
        {
          name: 'email',
          placeholder: this.email,
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: data => {
            if(data.email == null || data.email.length < 5 || data.email == undefined || data.email == true || data.email == false)
              this.showAlert("Error", "Invalid email format");                  
            else if(!data.email.includes("@") || !data.email.includes("."))
              this.showAlert("Error", "Invalid email format");
            else {
              this.fAuth.auth.currentUser.updateEmail(data.email).then(() => {
                this.fDb.object('users/' + this.services.auth.getUID() + '/email').set(String(data.email));
              }).catch(err => {
                this.showAlert("Error", err.message);
              });
            }                       
          }
        }
      ]
    });
    alert.present();
  }

  changeCard() {
    let alert = this.alertCtrl.create({
      title: 'Please enter your credit card number',
      inputs: [
        {
          name: 'card',
          placeholder: this.card,
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: data => {
            if(this.isValidNumber(data.card)) {
                this.fDb.object('users/' + this.services.auth.getUID() + '/card').set(String(data.card)).catch(err => {
                  this.showAlert("Error", err.message);
                });
            }                  
            else 
              this.showAlert("Error", "Invalid phone number");                       
          }
        }
      ]
    });
    alert.present();
  }

  isValidNumber(val: string) {
    for(let i = 0; i < val.length; i++) {
      if(val.charCodeAt(i) < 48 || val.charCodeAt(i) > 57)
        return false;
    }
    if(val.length != 16)
      return false;
    return true;
  }

  showAlert(title: string, message: string) {
    if(title == "Error") {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: message,
        buttons: ['OK'],
        cssClass: 'alertError'
      });
      alert.present();
    }
    else {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: message,
        buttons: ['OK'],
      });
      alert.present();
    }
  }

  ionViewWillLeave() {
    if(this.sub != null)
      this.sub.unsubscribe();
  }
}
