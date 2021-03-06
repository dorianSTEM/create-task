import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Socket } from 'ng-socket-io';

import { CreateEventPage } from "../create-event/create-event"


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username = "person";
  company = "123";
  timestamp: Number = 0;
  eventTemplate = [];

  constructor(public navCtrl: NavController, public storage: Storage, private socket: Socket, public modalCtrl: ModalController, public toastCtrl: ToastController) {
    var sock = this.socket;
    this.storage.get('username').then((val) => {
      this.username = val;
    });

    this.storage.get('company').then((val) => {
      this.company = val;
    });

    this.socket.connect();

    this.storage.get('session-id').then((val) => {
      this.socket.emit('session-id', {sessionID:val, timestamp:this.timestamp});
    });

    var that = this;

    this.socket.on('new', function(info){
      console.log("-------INFO-------");
      console.log(info);
      that.timestamp = info.timestamp; // update the timestamp based on new data
      console.log(that.timestamp);

      console.log(that.eventTemplate);

      that.eventTemplate = info.docs;

      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      for (var doc in info.docs){
        var thisTimeStamp = new Date(info.docs[doc].timestamp);
        var thisDate = new Date(info.docs[doc].date);

        console.log("TIME:", info.docs[doc].timestamp);
        info.docs[doc].prettyTime = months[thisTimeStamp.getMonth()] + " " + thisTimeStamp.getDate() + ", " + thisTimeStamp.getFullYear();
        info.docs[doc].prettyDate = months[thisDate.getMonth()] + " " + thisDate.getDate() + ", " + thisDate.getFullYear();
      }

      console.log("------------------");
    });

    this.socket.on('joiner', function(info){
      console.log("We got a joiner");
      console.log(info);
      for (var doc in info.docs){
        var confirmResult = confirm(info.docs[doc].username + " wants to join the company. Is this OK?");
        if (confirmResult){
          sock.emit('accept', {username:info.docs[doc].username});
        } 
      }
    });

    //this.data.username = username;
    //this.data.company = companyName;
  }

  createEvent(){
    let companyModal = this.modalCtrl.create(CreateEventPage);
    companyModal.present();
  }

  trackByIndex(index: number, value: number) {
    return index;
  }

  showMsg(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    
    toast.present();
  }
}
