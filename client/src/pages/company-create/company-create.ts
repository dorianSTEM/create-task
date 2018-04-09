import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-company-create',
  templateUrl: 'company-create.html'
})
export class CompanyCreatePage {
  creds:any = {};
  
  constructor(public navCtrl: NavController) {

  }
}
