import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Usuario } from '../../clases/usuario';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {Observable, Subject, of, from} from 'rxjs';
import { map, tap, takeUntil} from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/map';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private angularFire: AngularFireAuth,
    private firestore: AngularFirestore) {
  }
  coleccionTipada: AngularFirestoreCollection<Usuario>;
  listadoUsuarios: Observable<Usuario[]>;
  usuario:Usuario;
  nombre: string;
  pass: string;
  clave: string;
  valido:Boolean = false;
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  creaFondo(mensaje, imagen){
    let fondo = `
          <div>
            <ion-row>
              <ion-col>
                <img src="${imagen}">
              </ion-col>
            </ion-row>
            <ion-row>
              <h1> ${mensaje} </h1>
            </ion-row> 
          </div> `;
    return fondo;

}
ingresar(user:string){
  if(user){
    this.nombre = user;
  }
  switch (this.nombre) {
    case 'admin@gmail.com':
      this.clave= '111111';
      break;
    case 'invitado@gmail.com':
      this.clave = '222222';
      break;
    case 'usuario@gmail.com':
      this.clave = '333333';
      break;
    case 'anonimo@gmail.com':
      this.clave = '444444';
      break;
    case 'tester@gmail.com':
      this.clave = '555555';
      break;
    default:
      this.clave = this.pass;
      break;
  }
  this.login();
}
async login(){
    
  let esperador = this.esperar();
  esperador.present();
  
  await this.angularFire.auth.signInWithEmailAndPassword(this.nombre,this.clave)
    .then(result => 
      {
        esperador.dismiss();
        let logueado:Loading = this.esperar(this.creaFondo("Ingreso Correcto","assets/imgs/logueado.png"))
        logueado.present();
        logueado.onDidDismiss(alto => {
          this.navCtrl.push(HomePage, {
              usuario: this.usuario
            })
        })
        logueado.dismiss();
        this.coleccionTipada = this.firestore.collection<Usuario>('usuarios');
        // .snapshotChanges() returns a DocumentChangeAction[], which contains
        // a lot of information about "what happened" with each change. If you want to
        // get the data and the id use the map operator.
        this.listadoUsuarios = this.coleccionTipada.snapshotChanges().map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Usuario;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        });
          this.listadoUsuarios.map( datos =>{
            return datos.filter( usuarios => usuarios.nombre == this.nombre);
          }).subscribe(res =>{
            
            this.usuario = res[0];
            setTimeout(function() {
              logueado.dismiss();
            }, 2000);
            
          });
      })
    .catch(error =>
      {
        esperador.dismiss();
        let errorCode = error.code;
        let loadingError;
        if(errorCode === 'auth/invalid-email'){
            loadingError = this.esperar(this.creaFondo("Mail invalido", "assets/imgs/error.png"));
        }
        else if(error === 'auth/user-not-found'){
          loadingError = this.esperar(this.creaFondo("Usuario no encontrado", "assets/imgs/error.png"));
        }
        else if(error === 'auth/wrong-password'){
          loadingError = this.esperar(this.creaFondo("error con usuario/password", "assets/imgs/error.png"));
        }
        else{
          loadingError = this.esperar(this.creaFondo("Ha ocurrido un error", "assets/imgs/error.png"));
          console.log(errorCode);
        }
          loadingError.present();
          setTimeout(function() {
            loadingError.dismiss();
          }, 3000);
      });
}
esperar(personalizado?:string):Loading {
  let loading;
  if(!personalizado){
    loading = this.loadingCtrl.create({

      content: 'Por favor, espere...'
    });
  }
  else{
    loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: personalizado,
    })
  }
  return loading;
}

}
