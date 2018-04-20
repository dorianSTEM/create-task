import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public storage: Storage, private socket: Socket, public modalCtrl: ModalController) {
    this.storage.get('username').then((val) => {
      this.username = val;
    });

    this.storage.get('company').then((val) => {
      this.company = val;
    });

    this.socket.connect();

    this.storage.get('session-id').then((val) => {
      this.socket.emit('session-id', val);
    });

    this.socket.on('new', function(info){
      console.log("-------INFO-------");
      console.log(info);
      console.log("------------------");
    });

    //this.data.username = username;
    //this.data.company = companyName;
  }

  createEvent(){
    let companyModal = this.modalCtrl.create(CreateEventPage);
    companyModal.present();
  }
}
