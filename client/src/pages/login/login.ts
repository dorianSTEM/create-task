import { Http } from '@angular/http';

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  creds:any = {};
  constructor(
    public navCtrl: NavController,
    private http: Http,
    private storage: Storage
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) { }

  login() { // Login Authentication function with server
    let data = {
      usr: this.creds.username, // the data that will be sent to the server
      pwd: this.creds.password, // field names are shortened to reduce traffic
      cmp: this.creds.company
    }

    let loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
    loading.present();

    this.http.post('/login', data).subscribe(response => {
      var resBody = JSON.parse(response["_body"]);

      var toastMsg = "";
      if (resBody.loggedIn){
        toastMsg = "Successfully Logged In!";
        storage.set("session-id", resBody.session);
        
        this.navCtrl.setRoot(HomePage);
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
  
  register() {
    let data = {
      usr: this.creds.username, // the data that will be sent to the server
      pwd: this.creds.password, // field names are shortened to reduce traffic
      cmp: this.creds.company
    }
    
    let loading = this.loadingCtrl.create({
      content: 'Creating Account...'
    });
    
    loading.present();
    
    this.http.post('/signup', data).subscribe(response => {
      var resBody = JSON.parse(response["_body"]);
      loading.dismiss();
      
      if (!resBody.err) {
        let toast = this.toastCtrl.create({
          message: "Successfully Registered!",
          duration: 2000
        });
        
        toast.present();
        
        storage.set("session-id", resBody.session);
        
        this.navCtrl.setRoot(HomePage);
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


// https://ionicframework.com/docs/native/toast/
