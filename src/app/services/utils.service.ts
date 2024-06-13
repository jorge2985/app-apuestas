import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  controlCarga = inject(LoadingController);
  controlAviso = inject(ToastController);
  controlModal = inject(ModalController);
  controlAlerta = inject(AlertController);
  enrutador = inject(Router);

  constructor() { }

 
// *********** Subir una imagen ***********
async tomarImagen(promptLabelHeader: string) {
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    // devuelte el resultado de tomar la imagen en dato de URL
    resultType: CameraResultType.DataUrl,
    // desde dónde se toma la imagen, se elige desde la cámara o desde la galeria
    source: CameraSource.Prompt,
    promptLabelHeader,
    promptLabelPhoto: 'Selecciona una imagen',
    promptLabelPicture: 'Toma una foto'
  });
};


  // *********** Cargando ***********
  // muestro icono circular de carga
  cargando() {
    return this.controlCarga.create({ spinner: 'circular' })
  }

  // *********** Cargando ***********
  // muestra mensaje de alerta cuando se presiona eliminar la apuesta
  async mostrarAlerta(opciones?: AlertOptions) {
    const alerta = await this.controlAlerta.create(opciones);

    await alerta.present();
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

  // *********** Modal ***********
  async presentarModal(opciones: ModalOptions) {
    const modal = await this.controlModal.create(opciones);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  cierraModal(data?: any) {
    return this.controlModal.dismiss(data);
  }

}
