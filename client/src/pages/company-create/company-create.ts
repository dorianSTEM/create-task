import { Http } from '@angular/http';

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-company-create',
  templateUrl: 'company-create.html'
})
export class CompanyCreatePage {
  creds:any = {};
  
  constructor(
    public navCtrl: NavController,
    private http: Http,
    private storage: Storage,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
    
  }
  
  createComp() {
    var creds = this.creds;
    var loadingCtrl = this.loadingCtrl;
    var http = this.http;
    var toastCtrl = this.toastCtrl;
    var storage = this.storage;
    var navCtrl = this.navCtrl;

    this.storage.get('session-id').then((val) => {
      let data = {
        //usr: this.creds.username, // the data that will be sent to the server
        name: creds.name, // Company name
        descr: creds.description, // Company Description
        // pass: this.creds.passphrase // The passphrase used to join the company
        session:val
      }
      
      let loading = loadingCtrl.create({
        content: 'Creating Company...'
      });
      
      loading.present();
      
      http.post('http://create-performance.herokuapp.com/createCompany', data).subscribe(response => {
        var resBody = JSON.parse(response["_body"]);
        loading.dismiss();
        
        if (!resBody.err) {
          let toast = toastCtrl.create({
            message: "Successfully Created Company!",
            duration: 2000
          });
          
          toast.present();
          storage.set("company-joined", true);
          storage.set("company-verified", true);
    
          // this.navCtrl.pop(); // Remove this page from nav stack
          navCtrl.setRoot(HomePage);
        } else {
          let toast = toastCtrl.create({
            message: resBody.type,
            duration: 2000
          });

          toast.present();
        }
      });
    });
  }
}