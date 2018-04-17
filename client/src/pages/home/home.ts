import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username = "person";
  company = "123";

  constructor(public navCtrl: NavController, public storage: Storage, private socket: Socket) {
    this.storage.get('username').then((val) => {
      this.username = val;
    });

    this.storage.get('company').then((val) => {
      this.company = val;
    });

    this.socket.connect();
    this.storage.get('session-id').then((val) => {
      this.socket.emit('session', val);
    });

    //this.data.username = username;
    //this.data.company = companyName;
  }
}
