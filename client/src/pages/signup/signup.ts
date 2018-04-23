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
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage {
  creds:any = {};
  constructor(
    public navCtrl: NavController,
    private http: Http,
    private storage: Storage,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) { }
  
  register() {
    let data = {
      usr: this.creds.username, // the data that will be sent to the server
      pwd: this.creds.password, // field names are shortened to reduce traffic
      // cmp: this.creds.company
      // cmp: "",
      // pass: ""
    }

    // let companyModal = this.modalCtrl.create(PassPage);

    // companyModal.onDidDismiss(obj => {
      // this.userName = data.userName;

    // data.cmp = obj.company,
    // data.pass = obj.passphrase

    // if (!data.cmp || !data.pass){ // If no company name or password was provided
      // return 0; //exit out of function
    // }

    let loading = this.loadingCtrl.create({
      content: 'Creating Account...'
    });
    
    loading.present();
    
    this.http.post('http://create-performance.herokuapp.com/signup', data).subscribe(response => {
    var resBody = JSON.parse(response["_body"]);
    loading.dismiss();
    
    if (!resBody.err) {
      let toast = this.toastCtrl.create({
      message: "Successfully Registered!",
      duration: 2000
      });
      
      toast.present();
      
      this.storage.set("session-id", resBody.session);
      
      this.http.post('http://create-performance.herokuapp.com/authenticate', {session:resBody.session}).subscribe(response => {
        var resBody = JSON.parse(response["_body"]);
        if (!resBody.err){
          console.log("User Logged In, switching to Home Page");

          this.storage.set('username', resBody.username);
          this.storage.set('company', resBody.company);

          this.navCtrl.setRoot(HomePage); 
        }
      });
        
        this.navCtrl.setRoot(HomePage);
    } else {
        let toast = this.toastCtrl.create({
        message: resBody.type,
        duration: 2000
        });

        toast.present();
    }
    });
    // });

    // companyModal.present();
  }
}