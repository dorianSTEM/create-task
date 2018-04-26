import { Http } from '@angular/http';

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
// import { ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { VerificationPage } from '../company-verification/company-verification';


// import { LoginPage } from '../login/login';
// import { SignUpPage } from '../signup/signup'; 

@Component({
  selector: 'page-join-company',
  templateUrl: 'join-company.html'
})
export class JoinCompanyPage {
  creds:any = {};
//   loginPage = LoginPage;
//   signupPage = SignUpPage;

  constructor(
    public navCtrl: NavController,
    private http: Http,
    private storage: Storage,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    // public modalCtrl: ModalController
  ) {
      
  }

  joinComp(){
    var http = this.http;
    var toastCtrl = this.toastCtrl;

    let loading = this.loadingCtrl.create({
      content: 'Joining Company...'
    });

    this.storage.get('session-id').then((val) => {
      let data = {
        name: this.creds.name, // the data that will be sent to the server
        session: val
      }

      http.post('http://create-performance.herokuapp.com/joinCompany', data).subscribe(response => {
        var resBody = JSON.parse(response["_body"]);
        var toastMsg = "";
        if (!resBody.err){
          toastMsg = resBody.type;
        } else {
          toastMsg = "Success!"
        }

        let toast = toastCtrl.create({
          message: toastMsg,
          duration: 2000
        });

        this.storage.set("company-joined", true);

        loading.dismiss();
        toast.present();
        this.navCtrl.setRoot(VerificationPage);
      });
    });
  }
}