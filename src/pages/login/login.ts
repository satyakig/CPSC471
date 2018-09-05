import { Component } from '@angular/core';
import { IonicPage, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  formSignIn: FormGroup;
  formSignUp: FormGroup;  

  showSignup: boolean = false;

  constructor(private afAuth: AngularFireAuth, public afDb: AngularFireDatabase, public viewCtrl: ViewController, 
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public form: FormBuilder) 
    {
      this.formSignIn = this.form.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });

      this.formSignUp = this.form.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        card: ['', Validators.required],
        password: ['', Validators.required]
      });
      this.formSignIn.setValue({
        email: 'test@gmail.com',
        password: 'test123'
      });
    }

  login() {
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Logging in',
    });
    loader.present();

    if(this.formSignIn.valid) {
      let username = this.formSignIn.get('email').value;
      let password =  this.formSignIn.get('password').value;
      username = username.trim();
      password = password.trim();

      this.afAuth.auth.signInWithEmailAndPassword(username, password).then(() => {
        loader.dismiss();
        this.viewCtrl.dismiss();
      }).catch(err => {
        loader.dismiss();
        this.showAlert("Error", err.message);
      });
    }
    else {
      loader.dismiss();
      this.showAlert("Error", "Fields cannot be empty.");    
    }
  }

  showSignUp() {
    this.showSignup = true;
  }

  signUp() {
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Signing up',
    });
    loader.present();
    
    if(this.formSignUp.valid) {
      let email = this.formSignUp.get('email').value;
      let password =  this.formSignUp.get('password').value;
      let name =  this.formSignUp.get('name').value;
      let card =  this.formSignUp.get('card').value;

      email = email.trim();
      password = password.trim();
      name = name.trim();

      if(email != "" && password != "" && name != "") {
        if(this.isValidNumber(card)) {
          this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(() => {
            this.afDb.object('users/' + this.afAuth.auth.currentUser.uid).set({
              email: email,
              name: name,
              userID: this.afAuth.auth.currentUser.uid,
              card: card
            }).then(() => {
              loader.dismiss();
              this.viewCtrl.dismiss();
            });
          }).catch(err => {
            loader.dismiss();
            this.showAlert("Error", err.message);
          });
        }
        else {
          loader.dismiss();
          this.showAlert("Error", "Invalid credit card number.");    
        }
      }
      else {
        loader.dismiss();
        this.showAlert("Error", "Fields cannot be empty.");    
      }      
    }
    else {
      loader.dismiss();
      this.showAlert("Error", "Fields cannot be empty.");    
    }
  }

  forgotPassword() {
    let alert = this.alertCtrl.create({
      title: 'Forgot Password',
      subTitle: 'Please enter the email that you used to sign up.',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Reset Password',
          handler: data => {
            this.afAuth.auth.sendPasswordResetEmail(data.email).then(dt => {
              this.showAlert("Password Reset", "An Email will be sent to the address you provided, if an account is associated with it. Please follow those instructions to reset your password.");
            }).catch(err => {
              this.showAlert("Error", err.message);
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
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

  close() {
    this.viewCtrl.dismiss();
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

  showSuccessSignUp() {
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: 'You have been signed up!',
      buttons: ['OK']
    });
    alert.present();
  }
}
