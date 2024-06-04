import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Usuario } from '../../models/user.model';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-reseteo',
  templateUrl: './reseteo.page.html',
  styleUrls: ['./reseteo.page.scss'],
})
export class ReseteoPage implements OnInit {

  constructor() { }

  form = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
  })

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
      this.servicioFirebase.recuperoCorreo(this.form.value.correo).then(respuesta => {

        this.servicioUtilidades.presentToast({
          message: 'Correo validado con éxito',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'mail-outline'
        });

        // reenvía al usuario a la página de login luego de haber validado el correo
        this.servicioUtilidades.linkEnrutador('/login');
        this.form.reset()

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
