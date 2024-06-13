import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { Usuario } from '../models/user.model';
import { UtilsService } from '../services/utils.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private usuarioService: UsuarioService) { }

  servicioFirebase = inject(FirebaseService);
  servicioUtilidades = inject(UtilsService);
  datoUsuario = inject(UsuarioService);

  ngOnInit() {
  }

  // Función que envia datos y los valida con Firebase
  async enviar() {
    if (this.form.valid) {

      // almacena en 'cargando' el metodo 'cargando()' de utils.service.ts
      const cargando = await this.servicioUtilidades.cargando();
      await cargando.present();

      const usuarioData = {
        correo: this.form.controls.correo.value,
        password: this.form.controls.password.value
      };

      // Verifica los datos del logueo con el usuario creado en Firebase
      // this.servicioFirebase.logueo(this.form.value as Usuario).then(respuesta => {
      this.servicioFirebase.logueo(usuarioData).then(respuesta => {

        // Almacena la respuesta en el servicio UsuarioService para uilizarlo
        // en otros componentes y no depender de LocalSotrage
        this.datoUsuario.setearUsuario(respuesta.user);

        // obtiene los datos del usuario y pasa como parametros el ID del usuario
        // según las credenciales de Firebase
        this.obtenerInfoUsuario(respuesta.user.uid);

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

  async obtenerInfoUsuario(usuarioID: string) {
    if (this.form.valid) {

      // almacena en 'cargando' el metodo 'cargando()' de utils.service.ts
      const cargando = await this.servicioUtilidades.cargando();
      await cargando.present();

      let direccion = `usuario/${usuarioID}`;

      // obtiene los datos del logueo con el usuario creado en Firebase
      this.servicioFirebase.obtenerDocumento(direccion).then((usuario: Usuario) => {

        // guarda la información del usuario en el Local Storage
        this.servicioUtilidades.guardarEnLocalStorage('usuario', usuario);

        // redirige al usuario a la home
        this.servicioUtilidades.linkEnrutador('/home');

        // resetea los datos del formulario porque la info del usuario esta guardada en el LocalStorage
        this.form.reset();

        // pop-up que con mensaje de bienvenida al usuario
        this.servicioUtilidades.presentToast({
          message: `Te damos la bienvenica ${usuario.nombre}`,
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'person-circle-outline'

        })

      })

        // Devuelve mensaje de error si el usuario o la contraseña son incorrectos
        .catch(error => {
          console.error(`Hubo un error en la verificación de los datos ${error}`)

          // pop-up que contiene mensaje de error
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
