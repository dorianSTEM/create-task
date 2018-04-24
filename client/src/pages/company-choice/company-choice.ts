// import { Http } from '@angular/http';

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { ToastController } from 'ionic-angular';
// import { LoadingController } from 'ionic-angular';
// import { ModalController } from 'ionic-angular';
// import { Storage } from '@ionic/storage';

// import { LoginPage } from '../login/login';
// import { SignUpPage } from '../signup/signup';

import { JoinCompanyPage } from '../join-company/join-company';

@Component({
  selector: 'page-choice-company',
  templateUrl: 'company-choice.html'
})
export class CompanyChoicePage {
  creds:any = {};
//   loginPage = LoginPage;
//   signupPage = SignUpPage;
  joinCompanyPage = JoinCompanyPage;

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