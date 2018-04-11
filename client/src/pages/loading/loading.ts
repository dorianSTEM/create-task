import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html'
})
export class LoadingPage {
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
  ) { 
    let loading = this.loadingCtrl.create({
        content: 'Please Wait...'
    });
    loading.present();
  }
}