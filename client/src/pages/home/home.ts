import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data:any = {
    username: "bob",
    company: "Hello World Inc."
  };

  username = "bobby";
  constructor(public navCtrl: NavController, public storage: Storage) {
    var username;
    var companyName;

    this.storage.get('username').then((val) => {
      username = val;
    });

    this.storage.get('company').then((val) => {
      companyName = val;
    });

    this.data.username = username;
    this.data.company = companyName;
  }
}
