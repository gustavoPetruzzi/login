import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { NativeAudio } from '@ionic-native/native-audio';
/**
 * Generated class for the SplashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private audioNativo: NativeAudio) {
    this.audioNativo.preloadSimple('intro', 'assets/sonidos/intro.mp3')
    .then(()=>{});
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.audioNativo.play('intro')
      .then(()=>{
        setTimeout(() => {
          this.navCtrl.setRoot(LoginPage)
        }, 3000);
      })
    }, 2000);
  }

}
