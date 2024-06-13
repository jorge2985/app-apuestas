import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { Usuario } from '../models/user.model';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  form = new FormGroup({
    usuarioID: new FormControl(''),
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  constructor() { }

  servicioFirebase = inject(FirebaseService);
  servicioUtilidades = inject(UtilsService)

  ngOnInit() {
  }

  // Función que envia datos y los valida con Firebase
  async enviar() {
    if (this.form.valid) {

      // almacena en 'cargando' el metodo 'cargando()' de utils.service.ts
      const cargando = await this.servicioUtilidades.cargando();
      await cargando.present();

      // Verifica los datos del logueo con el usuario creado en Firebase
      this.servicioFirebase.registroUsuario(this.form.value as Usuario).then(async respuesta => {

          await this.servicioFirebase.actualizarUsuario(this.form.value.nombre);
          
          let usID = respuesta.user.uid;
          this.form.controls.usuarioID.setValue(usID);

          this.cargaInfoUsuario(usID);

        })

        // Devuelve mensaje de error si el usuario o la contraseña son incorrectos
        .catch(error => {
          console.error(`Hubo un error en la verificación de los datos ${error}`)

          this.servicioUtilidades.presentToast({
            message: error.message,
            duration: 2500,
            color: 'warning',
            position: 'middle',
            icon: 'alert-circle-outline'
          })

        })
        .finally(() => {
          cargando.dismiss();
        })
    }
  }

  async cargaInfoUsuario(usuarioID: string) {
    if (this.form.valid) {

      // almacena en 'cargando' el metodo 'cargando()' de utils.service.ts
      const cargando = await this.servicioUtilidades.cargando();
      await cargando.present();

      let direccion = `usuario/${usuarioID}`;
      delete this.form.value.password;

      // crea un documento con los datos del usuario que se obtienen del form y la url del usuario
      this.servicioFirebase.crearDocumento(direccion, this.form.value).then(async respuesta => {

        // guarda la información del usuario en el Local Storage
        // this.servicioUtilidades.guardarEnLocalStorage('usuario', this.form.value);

        // redirige al usuario a la home
        this.servicioUtilidades.linkEnrutador('/home');

        // resetea los datos del formulario porque la info del usuario esta guardada en el LocalStorage
        this.form.reset();

        })

        // Devuelve mensaje de error si el usuario o la contraseña son incorrectos
        .catch(error => {
          console.error(`Hubo un error en la verificación de los datos ${error}`)

          this.servicioUtilidades.presentToast({
            message: error.message,
            duration: 2500,
            color: 'warning',
            position: 'middle',
            icon: 'alert-circle-outline'
          })

        })
        .finally(() => {
          cargando.dismiss();
        })
    }
  }

}
