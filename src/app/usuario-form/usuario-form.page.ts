import { Component, OnInit, inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { FirebaseService } from '../services/firebase.service';
import { Usuario } from '../models/user.model';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.page.html',
  styleUrls: ['./usuario-form.page.scss'],
})
export class UsuarioFormPage implements OnInit {

  servicioFirebase = inject(FirebaseService);
  utilidadesServ = inject(UtilsService);

  usuario = {} as Usuario;

  constructor() { }

  ngOnInit() {
  }
  
  async tomarImagen() {

    //let usuario = this.usuario();
    let direccion = `usuario/${this.usuario.usuarioID}`;

    // de la función tomarImagen se obtiene los datos de la URL
    const dataURL = (await this.utilidadesServ.tomarImagen('Imagen de Perfil')).dataUrl;

    // almacena en 'cargando' el metodo 'cargando()' de utils.service.ts
    const cargando = await this.utilidadesServ.cargando();
    await cargando.present();    

    let direccionImagen = `${this.usuario.usuarioID}/perfil`;
    this.usuario.imagen = await this.servicioFirebase.subirImagen(direccionImagen, dataURL);

    this.servicioFirebase.actualizarApuesta(direccion, { imagen: this.usuario.imagen }).then(async res => {

      //this.utilidadesServ.guardarEnLocalStorage('usuario', usuario);

      this.utilidadesServ.presentToast({
        message: 'Imagen actualizada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => {
      console.log(error);

      this.utilidadesServ.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })

    }).finally(() => {
      cargando.dismiss();
    })
  }

}
