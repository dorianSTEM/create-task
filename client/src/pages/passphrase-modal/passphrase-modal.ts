import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-pass',
  templateUrl: 'passphrase-modal.html'
})
export class PassPage {
  creds:any = {};
  constructor(public navCtrl: NavController) {

  }
}
