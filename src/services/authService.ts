import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core'
import { Subscription } from 'rxjs/Subscription';
import { ToastController, AlertController } from 'ionic-angular';
import * as moment from 'moment';

import { User } from './../data_structures/user';
import { Message } from './../data_structures/message';

@Injectable()
export class AuthService {

    private sub1: Subscription = null;
    private sub2: Subscription = null;

    private name: string = "";
    private access: number = 2;

    constructor(private fAuth: AngularFireAuth, private fDb: AngularFireDatabase, public toastCtrl: ToastController,
    public alertCtrl: AlertController) {

        this.fAuth.authState.subscribe((auth) => {
            if(auth) {                
                this.sub1 = this.fDb.object<User>('users/' + this.getUID()).valueChanges().subscribe(
                    user => {
                        this.name = user.name;
                        this.access = user.access;
                    }
                );

                this.sub2 = this.fDb.list<Message>('users/' + this.getUID() + '/messages').snapshotChanges(['child_added'])
                .subscribe(actions => {
                    actions.forEach(action => {
                        let sent = action.payload.val().date;
                        let now = this.nowUnix();

                        if(sent >= now - 30)
                            this.showToast(action.payload.val().message);
                    });
                });
            }
            else {
                this.name = "";
                this.access = 2;

                if(this.sub1 != null)
                    this.sub1.unsubscribe();
                if(this.sub2 != null)
                    this.sub2.unsubscribe();
            }
        });
    }

    isLoggedIn() {
        if(this.fAuth == null || this.fAuth == undefined)
            return false;
        else if(this.fAuth.auth == null || this.fAuth.auth == undefined)
            return false;
        else if(this.fAuth.auth.currentUser == null || this.fAuth.auth.currentUser == undefined)
            return false;
        else
            return true;
    }

    getUID() {
        if(this.isLoggedIn())
            return this.fAuth.auth.currentUser.uid;
        else
            return null;
    }

    getEmail() {
        if(this.isLoggedIn())
            return this.fAuth.auth.currentUser.email;
        else
            return null;
    }

    getName() {
        return this.name;
    }

    getAccess() {
        return this.access;
    }

    nowUnix() {
        return moment().unix();
    }

    showAlert(title: string, message: string) {
        let alert = this.alertCtrl.create({
          title: title,
          subTitle: message,
          buttons: ['OK']
        });
        alert.present();
    }

    showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 5000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: "OK"
        });
        
        toast.present();
    }
}