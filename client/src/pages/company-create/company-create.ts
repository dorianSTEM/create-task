import { Http } from '@angular/http';

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


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
    let data = {
      //usr: this.creds.username, // the data that will be sent to the server
      name: this.creds.name, // Company name
      dscr: this.creds.description, // Company Description
      pass: this.creds.passphrase // The passphrase used to join the company
    }
    
    let loading = this.loadingCtrl.create({
      content: 'Creating Company...'
    });
    
    loading.present();
    
    this.http.post('/createCompany', data).subscribe(response => {
      var resBody = JSON.parse(response["_body"]);
      loading.dismiss();
      
      if (!resBody.err) {
        let toast = this.toastCtrl.create({
          message: "Successfully Created Company!",
          duration: 2000
        });
        
        toast.present();
  
        this.navCtrl.pop(); // Remove this page from nav stack
      } else {
        let toast = this.toastCtrl.create({
          message: resBody.type,
          duration: 2000
        });

        toast.present();
      }
    });
  }
}