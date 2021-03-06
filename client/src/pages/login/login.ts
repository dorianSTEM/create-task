import { Http } from '@angular/http';

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';
import { CompanyCreatePage } from '../company-create/company-create';
import { PassPage } from '../passphrase-modal/passphrase-modal';
import { VerificationPage } from '../company-verification/company-verification';
import { CompanyChoicePage } from '../company-choice/company-choice';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  creds:any = {};
  constructor(
    public navCtrl: NavController,
    private http: Http,
    private storage: Storage,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) { }

  login() { // Login Authentication function with server
    let data = {
      usr: this.creds.username, // the data that will be sent to the server
      pwd: this.creds.password, // field names are shortened to reduce traffic
    }

    let loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });

    loading.present();

    this.http.post('http://create-performance.herokuapp.com/login', data).subscribe(response => {
      var resBody = JSON.parse(response["_body"]);

      var toastMsg = "";
            
      if (resBody.loggedIn && resBody.company && resBody.verified) {
        toastMsg = "Successfully Logged In!";
        this.storage.set("session-id", resBody.session);

        this.storage.set("company-joined", true);
        this.storage.set("company-verified", true);

        this.http.post('http://create-performance.herokuapp.com/authenticate', {session:resBody.session}).subscribe(response => {
          var resBody = JSON.parse(response["_body"]);
          if (!resBody.err){
            console.log("User Logged In, switching to Next Page");

            this.storage.set('username', resBody.username);
            this.storage.set('company', resBody.company);
            this.navCtrl.setRoot(HomePage); 
            
          } else {
            toastMsg = "Error, Please Try Again..";
          }
        });
      } else if (resBody.loggedIn && !resBody.company) {
        this.storage.set("session-id", resBody.session);
        this.storage.set("company-joined", false);
        this.storage.set("company-verified", false);
        this.navCtrl.setRoot(CompanyChoicePage);
      } else if (!resBody.verified) {
        this.storage.set("session-id", resBody.session);
        this.storage.set("company-joined", true);
        this.storage.set("company-verified", false);
        this.navCtrl.setRoot(VerificationPage); //show company verification page
      } else {
        toastMsg = "Invalid Credentials"
      }
      let toast = this.toastCtrl.create({
        message: toastMsg,
        duration: 2000
      });

      loading.dismiss();
      toast.present();
    });
  }
}


// https://ionicframework.com/docs/native/toast/
