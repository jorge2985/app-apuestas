import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Usuario } from '../../models/user.model';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.scss'],
})
export class AgregarProductoComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    imagen: new FormControl('', [Validators.required]),
    importe: new FormControl('', [Validators.required, Validators.min(1)])
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
      this.servicioFirebase.registroUsuario(this.form.value as Usuario)
        .then(async respuesta => {

          await this.servicioFirebase.actualizarUsuario(this.form.value.nombre);

          let usID = respuesta.user.uid;

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
