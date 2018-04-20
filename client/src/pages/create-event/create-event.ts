import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Socket } from 'ng-socket-io';

import { LoadingController } from 'ionic-angular';

import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html'
})
export class CreateEventPage {
    creds: any = {};
    constructor(private http: Http, private storage: Storage, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {

    }

    eventCreate(){
      var session;

      this.storage.get('session-id').then((val) => {
        session =  val;
      }).then(function(){
        let data = {
          title: this.creds.title, // the data that will be sent to the server
          msg: this.creds.description, // field names are shortened to reduce traffic
          session: session
        }
  
        console.log("SESSION", data.session);
    
        let loading = this.loadingCtrl.create({
          content: 'Publishing Event...'
        });
  
        loading.present();
    
        this.http.post('/createEvent', data).subscribe(response => {
          var resBody = JSON.parse(response["_body"]);
  
          var toastMsg = "";
          if (!resBody.err){
            toastMsg = "Success!"
          } else {
            toastMsg = "Unknown Error, pleasy try again later..."
          }
  
          let toast = this.toastCtrl.create({
            message: toastMsg,
            duration: 2000
          });
          loading.dismiss();
          toast.present();
        });
      });
    }
}