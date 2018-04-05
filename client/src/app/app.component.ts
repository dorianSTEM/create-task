import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, http: Http, storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
      storage.get('session-id').then((val) => {
        
        console.log('We have session ', val);
        if (val){
          this.http.post('/authenticate', data).subscribe(response => {
            var resBody = JSON.parse(response["_body"]);
            if (!resBody.err){
              this.rootPage = HomePage; 
            }
          });
        }
      }).then(() = > {
          statusBar.styleDefault();
          splashScreen.hide();
      });
    });
  }
}

