import { Http } from '@angular/http';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { LoginChoicePage } from '../pages/login-choice/login-choice';
import { CompanyCreatePage } from '../pages/company-create/company-create';
import { LoadingPage } from '../pages/loading/loading';

import { JoinCompanyPage } from '../pages/join-company/join-company';
import { VerificationPage } from '../pages/company-verification/company-verification';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  rootPage:any = LoadingPage;
  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public http: Http, public storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
      this.pages = [
        { title: 'Home', component: HomePage }
        //{ title: 'List', component: ListPage }
      ];
      
      //this.storage.get('session-id').then((val) => {
      Promise.all([this.storage.get("session-id"), this.storage.get("company-joined"), this.storage.get("company-verified")]).then(values => {
        var val = values[0];
        
        var compJoined = values[1];
        var compVerified = values[2];

        console.log('We have session ', val);
        if (val){
          this.http.post('http://create-performance.herokuapp.com/authenticate', {session:val}).subscribe(response => {
            var resBody = JSON.parse(response["_body"]);
            if (!resBody.err && compJoined && resBody.obj.verified){
              console.log("User Logged In, switching to Home Page");

              this.storage.set('username', resBody.username);
              this.storage.set('company', resBody.company);

              this.rootPage = HomePage; 

            } else if (!resBody.err && compJoined) {
              this.rootPage = VerificationPage;
            } else if (!resBody.err){
              console.log(resBody);
              this.rootPage = JoinCompanyPage;
            } else {
              // this.rootPage = LoginPage;
              console.log("ERROR");
              console.log(resBody);
              this.rootPage = LoginChoicePage;
            }
          });
        } else {
          this.rootPage = LoginChoicePage;
        }
      }).then((val) => {
          statusBar.styleDefault();
          splashScreen.hide();
          // this.rootPage.loading.dismiss();
      });
    });
  }
  
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

