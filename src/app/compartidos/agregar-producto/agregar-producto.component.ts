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

  @Input() apuesta: Apuesta;
  @Input() evento: any;


  form = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl('', [Validators.required]),
    strLeague: new FormControl({ value: '', disabled: true }, [Validators.required]),
    strEvent: new FormControl({ value: '', disabled: true }, [Validators.required]),
    importe: new FormControl(null, [Validators.required, Validators.min(1)])
  })

  constructor() { }

  servicioFirebase = inject(FirebaseService);
  servicioUtilidades = inject(UtilsService)

  usuario = {} as Usuario;

  ligaLabel: string = '';
  eventoLabel: string = '';

  ngOnInit() {

    this.usuario = this.servicioUtilidades.obtenerDeLocalStorage('usuario');

    // Si existe la apuesta 'setea' los campos del formulario con los datos de la apuesta.
    if (this.apuesta) {
      this.form.setValue(this.apuesta);

    } else if (this.evento) {

      this.form.controls.strLeague.setValue(this.evento.strLeague);
      this.form.controls.strEvent.setValue(this.evento.strEvent);
      this.ligaLabel = this.evento.strLeague;
      this.eventoLabel = this.evento.strEvent;

    }

  }

  async enviar() {

    if (this.apuesta) this.editarApuesta();
    else this.crearApuesta();

  }


  // *********** Subir una imagen ***********
  async tomarImagen() {
    const dataURL = (await this.servicioUtilidades.tomarImagen('Imagen del usuario')).dataUrl
    // guarda la imagen en el campo del formulario. Pasa la url de la imagen
    // this.form.controls.imagen.setValue(dataUrl);
  }


  // *********** Convierte los inputs a número ***********
  convierteNumero() {

    let { importe } = this.form.controls;

    // si existe un valor en 'importe' entonces modifica a float el valor de 'importe'
    if (importe.value) importe.setValue(parseFloat(importe.value))
  }


  // *********** Crea la apuesta en e Firebace ***********
  // Función que envia datos a Firebase para crear una apuesta
  async crearApuesta() {

    // ruta en la que se van a guardar las apuestas del usuario
    let direccion = `usuario/${this.usuario.usuarioID}/apuestas`;

    // almacena en 'cargando' el metodo 'cargando()' de utils.service.ts
    const cargando = await this.servicioUtilidades.cargando();
    await cargando.present();

    delete this.form.value.id;

    const apuestaData = {
      nombre: this.form.controls.nombre.value,
      strLeague: this.form.controls.strLeague.value,
      strEvent: this.form.controls.strEvent.value,
      importe: this.form.controls.importe.value
    };

    // llama a la función crearApuesta() desde firebase.service.ts
    // se pasan como parametros la direccion en firebase de las apuestas del usuario y los valores del formulario
    this.servicioFirebase.crearApuesta(direccion, apuestaData).then(async respuesta => {

      // envia como parametro el nombre del usuario para actualizarlos en Firebase
      await this.servicioFirebase.actualizarUsuario(this.form.value.nombre);

      this.servicioUtilidades.guardarEnLocalStorage('apuesta', apuestaData);

      console.log(apuestaData)

      this.servicioUtilidades.cierraModal({ success: true })

      this.servicioUtilidades.presentToast({
        message: 'Apuesta creada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

      // Devuelve mensaje de error si el usuario o la contraseña son incorrectos
    }).catch(error => {
      console.error(`Hubo un error en la verificación de los datos ${error}`)
    }).finally(() => {
      cargando.dismiss();
    })
  }


  // *********** Edita la apuesta en e Firebace ***********
  // envía los datos editados en el componente para actualizar una apuesta
  async editarApuesta() {

    // ruta de firebase en la que se van a guardar las apuestas del usuario
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
      this.servicioUtilidades.cierraModal({ success: true })

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
