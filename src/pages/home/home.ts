import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { Usuario } from "../../clases/usuario";
import { Credito } from "../../clases/credito";
import { Codigo } from "../../clases/codigo";
import { Observable } from 'rxjs';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  usuario: Usuario;
  credito:number;
  recienCargado = 0;
  codigo:string;
  codigos:Codigo[] = [];
  orientation: String;
  portrait: Boolean;
  listadoCodigos: Observable<Codigo[]>;

  constructor(
    platform: Platform,
    private screenOrientation: ScreenOrientation,
    public navCtrl: NavController,
    public params: NavParams,
    public loadingCtrl: LoadingController,
    private scanner: BarcodeScanner,
    private firestore: AngularFirestore
    ) 
  {
    platform.ready()
    .then(() =>{
      this.orientation = this.screenOrientation.type;
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    });

    this.usuario = new Usuario();
    this.usuario = this.params.get('usuario');
    this.credito = this.usuario.credito;
    console.log(this.usuario);
    this.listadoCodigos = this.firestore.collection<Codigo>('/credito').valueChanges();
    let spinner = this.spinnerPropio();
    spinner.present();
    this.listadoCodigos
    .subscribe(
      data =>{
        data.forEach(element =>{
          let nuevo = new Codigo();
          nuevo.codigo = element.codigo;
          nuevo.monto = element.monto;
          this.codigos.push(nuevo);
          console.log(this.codigos);
        });
        spinner.dismiss();
      })
  }

  public escanear(){
    this.scanner.scan()
    .then(barcodeData =>{
      this.codigo = barcodeData.text;
      this.cargarCredito();
    })
    .catch(err =>{
      console.log('Error ', err);
    })
  }

  usado(nuevo:String):boolean{
    let usado = false;
    this.usuario.usados.forEach(element =>{
      if(element == nuevo){
        usado = true;
      }
    })
    return usado;
  }
  public cargarCredito(){

    if(!this.usado(this.codigo)){
      let existe = false;
      let aCargar:Codigo;
      this.codigos.forEach(element => {
        if(this.codigo == element.codigo){
          aCargar = new Codigo();
          aCargar.monto = element.monto;
          aCargar.codigo = element.codigo;
          existe =true;
        }
      });
      if(!existe){
        let loading = this.esperar(this.creaFondo("Código no identificado", "assets/imgs/error.png"));
        loading.present();
        setTimeout(() =>{
          loading.dismiss();
        }, 3000);
      }
      else if(existe){
        let cadena = "se cargó " + aCargar.monto + " créditos!";
        this.usuario.credito = +this.usuario.credito + +aCargar.monto;
        this.usuario.usados.push(this.codigo);
        this.guardar(cadena);
      }
    }
    else{
      let loading = this.esperar(this.creaFondo("Código ya usado", "assets/imgs/error.png"));
      loading.present();
      setTimeout(()=>{
        loading.dismiss();
      }, 3000);
    }
  }

  public guardar(mensaje:string){
    let cargando = this.spinnerCargando();
    cargando.present();
    let loading = this.esperar(this.creaFondo(mensaje, "assets/imgs/calavera.png"));
    this.firestore
    .collection('usuarios')
    .doc(this.usuario.id)
    .set(
      {
        credito: this.usuario.credito,
        usados: this.usuario.usados,
        nombre: this.usuario.nombre,
        clave: this.usuario.clave,
        perfil: this.usuario.perfil,
        sexo: this.usuario.sexo
      },
      { merge: true}
    ).then(res =>{
      cargando.dismiss();
      this.credito = this.usuario.credito;
      loading.present();
      setTimeout(() =>{
        loading.dismiss();
      }, 3000);
    })
  }






  public esperar(personalizado?:string){
    let loading;
    if(!personalizado){
      loading = this.loadingCtrl.create({
        content: 'Por favor, espere...'
      })
    }
    else{
      loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: personalizado,
      })
    }
    return loading;
  }

  public spinnerCargando(){
    let spinner = this.loadingCtrl.create({
      content:"Cargando Crédito...",
    })
    return spinner;
  }
  public creaFondo(mensaje, imagen){
    let fondo:string;
    if(mensaje){
      fondo = `<div>
                 <ion-row text-center>
                   <img src="${imagen}">
                 </ion-row>
                 <ion-row text-center>
                   <h1 text-center> ${mensaje} </h1>
                 </ion-row>
               </div> `;
    }
    return fondo;
  }

  public spinnerPropio(){
    let spinner = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<ion-row text-center>
                  <img class="spinner" src="assets/imgs/calavera.png">
                </ion-row>
                `,
      cssClass: 'my-loading-class',
    })
    return spinner;
  }
}
