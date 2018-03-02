import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core'
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

import { User } from './../data_structures/user';

@Injectable()
export class AuthService {

    private sub: Subscription = null;
    private name: string = "";

    constructor(private fAuth: AngularFireAuth, private fDb: AngularFireDatabase) {

        this.fAuth.authState.subscribe((auth) => {
            if(auth) {
                
                this.sub = this.fDb.object<User>('users/' + this.getUID()).valueChanges().subscribe(
                    user => {
                        this.name = user.name;
                    }
                );
            }
            else {
                if(this.sub != null)
                    this.sub.unsubscribe();
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
}