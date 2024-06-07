import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Usuario } from '../../models/user.model';
import { UtilsService } from '../../services/utils.service';
import { Apuesta } from 'src/app/models/apuesta.model';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.scss'],
})
export class AgregarProductoComponent implements OnInit {

  @Input() apuesta: Apuesta

  form = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', [Validators.required]),
    //imagen: new FormControl('', [Validators.required]),
    importe: new FormControl(null, [Validators.required, Validators.min(1)])
  })

  constructor() { }

  servicioFirebase = inject(FirebaseService);
  servicioUtilidades = inject(UtilsService)

  usuario = {} as Usuario;

  ngOnInit() {

    this.usuario = this.servicioUtilidades.obtenerDeLocalStorage('usuario');
    if (this.apuesta) this.form.setValue(this.apuesta);

  }

  async enviar() {
    if (this.apuesta) this.editarApuesta();
    else this.crearApuesta();

  }

  // Función que envia datos a Firebase para crear una apuesta
  async crearApuesta() {

    // ruta en la que se van a guardar las apuestas del usuario
    let direccion = `usuario/${this.usuario.usuarioID}/apuestas`;

    // almacena en 'cargando' el metodo 'cargando()' de utils.service.ts
    const cargando = await this.servicioUtilidades.cargando();
    await cargando.present();

    delete this.form.value.id;

    // llama a la función crearApuesta() desde firebase.service.ts
    // se pasan como parametros la direccion de las apuestas del usuario y los valores del formulario
    this.servicioFirebase.crearApuesta(direccion, this.form.value).then(async respuesta => {

      await this.servicioFirebase.actualizarUsuario(this.form.value.nombre);

      this.servicioUtilidades.despedirModal({ success: true })

      this.servicioUtilidades.presentToast({
        message: 'Apuesta creada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    })

      // Devuelve mensaje de error si el usuario o la contraseña son incorrectos
      .catch(error => {
        console.error(`Hubo un error en la verificación de los datos ${error}`)



      })
      .finally(() => {
        cargando.dismiss();
      })
  }

  // envía los datos editados en el componente para actualizar una apuesta
  async editarApuesta() {

    // ruta en la que se van a guardar las apuestas del usuario
    let direccion = `usuario/${this.usuario.usuarioID}/apuestas/${this.apuesta.id}`;

    // almacena en 'cargando' el metodo 'cargando()' de utils.service.ts
    const cargando = await this.servicioUtilidades.cargando();
    await cargando.present();

    delete this.form.value.id;
    
    // llama a la función actualizarApuesta() desde firebase.service.ts
    // se pasan como parametros la direccion de las apuestas del usuario y los valores del formulario
    this.servicioFirebase.actualizarApuesta(direccion, this.form.value).then(async respuesta => {

      await this.servicioFirebase.actualizarUsuario(this.form.value.nombre);

      // la función despedirModal() cierra el modal
      this.servicioUtilidades.despedirModal({ success: true })

      this.servicioUtilidades.presentToast({
        message: 'Apuesta creada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    })

      // Devuelve mensaje de error si el usuario o la contraseña son incorrectos
      .catch(error => {
        console.error(`Hubo un error en la verificación de los datos ${error}`)



      })
      .finally(() => {
        cargando.dismiss();
      })
  }

}
