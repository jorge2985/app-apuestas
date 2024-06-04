import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  controlCarga = inject(LoadingController);
  controlAviso = inject(ToastController);
  enrutador = inject(Router)
  
  constructor() { }

  // *********** Cargando ***********
  // muestro icono circular de carga
  cargando() {
    return this.controlCarga.create({ spinner: 'circular' })
  }

  // *********** Aviso Error ***********
  async presentToast(opts?: ToastOptions) {
    const mensaje = await this.controlAviso.create(opts)
    mensaje.present();
  }

  // *********** Enruta a cuaquier página disponible ***********
  linkEnrutador(url: string) {
    return this.enrutador.navigateByUrl(url);
  }

  // *********** Guarda elementos en el LocalStorage ***********
  guardarEnLocalStorage(llave: string, valor: any) {
    return localStorage.setItem(llave, JSON.stringify(valor))
  }

  // *********** Obtiene elementos en el LocalStorage ***********
  obtenerDeLocalStorage(llave: string) {
    return JSON.parse(localStorage.getItem(llave))
  }


}
