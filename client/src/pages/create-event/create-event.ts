import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

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
    session: any;

    constructor(private http: Http, private storage: Storage, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public viewCtrl: ViewController) {
    }

    eventCreate(){
      var creds = this.creds;
      var loadingCtrl = this.loadingCtrl;
      var http = this.http;
      var toastCtrl = this.toastCtrl;
      var viewCtrl = this.viewCtrl;

      Promise.all([this.storage.get("session-id"), this.storage.get("username")]).then(values => {
        var session =  values[0];
        var username = values[1];
        
        console.log("After getting it, the session is", session);

        let data = {
          title: creds.title, // the data that will be sent to the server
          msg: creds.description, // field names are shortened to reduce traffic
          session: session,
          author: username,
          date: new Date(creds.date)
        }

        console.log('DATE: ', creds.date);
    
        let loading = loadingCtrl.create({
          content: 'Publishing Event...'
        });
  
        loading.present();
    
        http.post('/createEvent', data).subscribe(response => {
          var resBody = JSON.parse(response["_body"]);
  
          var toastMsg = "";
          if (!resBody.err){
            toastMsg = "Success!"
          } else {
            toastMsg = "Unknown Error, pleasy try again later..."
          }
  
          let toast = toastCtrl.create({
            message: toastMsg,
            duration: 2000
          });
          loading.dismiss();
          toast.present();
          viewCtrl.dismiss();
        });
      });

    }
}