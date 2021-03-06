import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/signup/signup';
import { CompanyCreatePage } from '../pages/company-create/company-create';
import { PassPage } from '../pages/passphrase-modal/passphrase-modal';
import { LoadingPage } from '../pages/loading/loading';
import { CreateEventPage } from '../pages/create-event/create-event';

import { LoginChoicePage } from '../pages/login-choice/login-choice';
import { CompanyChoicePage } from '../pages/company-choice/company-choice';
import { JoinCompanyPage } from '../pages/join-company/join-company';
import { VerificationPage } from '../pages/company-verification/company-verification';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'https://create-performance.herokuapp.com/', options: {} };

//import { Toast } from '@ionic-native/toast';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    CompanyCreatePage,
    PassPage,
    LoadingPage,
    CreateEventPage,
    LoginChoicePage,
    SignUpPage,
    CompanyChoicePage,
    JoinCompanyPage,
    VerificationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SocketIoModule.forRoot(config),
    HttpModule,
    //Toast
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    CompanyCreatePage,
    PassPage,
    LoadingPage,
    CreateEventPage,
    LoginChoicePage,
    SignUpPage,
    CompanyChoicePage,
    JoinCompanyPage,
    VerificationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
