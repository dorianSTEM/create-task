// import { Http } from '@angular/http';

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { ToastController } from 'ionic-angular';
// import { LoadingController } from 'ionic-angular';
// import { ModalController } from 'ionic-angular';
// import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { SignUpPage } from '../signup/signup';

@Component({
  selector: 'page-choice-login',
  templateUrl: 'login-choice.html'
})
export class LoginChoicePage {
  creds:any = {};
  loginPage = LoginPage;
  signupPage = SignUpPage;

  constructor(
    public navCtrl: NavController,
    // private http: Http,
    // private storage: Storage,
    // public toastCtrl: ToastController,
    // public loadingCtrl: LoadingController,
    // public modalCtrl: ModalController
  ) {
      
  }
}