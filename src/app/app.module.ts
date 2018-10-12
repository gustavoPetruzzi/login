import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';

//AF
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NativeAudio } from '@ionic-native/native-audio';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
export const firebaseConfig = {
  apiKey: "AIzaSyBL7LrUdPL17ifVhMLBA0Rsu0-RLn81hF4",
  authDomain: "logueo-ffa46.firebaseapp.com",
  databaseURL: "https://logueo-ffa46.firebaseio.com",
  projectId: "logueo-ffa46",
  storageBucket: "logueo-ffa46.appspot.com",
  messagingSenderId: "799164691041"
};
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SplashPage,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),

    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig, 'unaApp'),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SplashPage,
    LoginPage,
    HomePage
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireDatabase,
    BarcodeScanner,
    NativeAudio
  ]
})
export class AppModule {}
