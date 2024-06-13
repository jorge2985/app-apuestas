import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Usuario } from '../../models/user.model';
import { UtilsService } from '../../services/utils.service';
import { Apuesta } from 'src/app/models/apuesta.model';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
    nombre: new FormControl(''),
    strLeague: new FormControl({ value: '', disabled: true }, [Validators.required]),
    strEvent: new FormControl({ value: '', disabled: true }, [Validators.required]),
    idEvent: new FormControl(''),
    strSport: new FormControl(''),
    strTimestamp: new FormControl(null),
    strAwayTeam: new FormControl(''),
    strHomeTeam: new FormControl(''),
    importe: new FormControl(null, [Validators.required, Validators.min(1)]),
    equipoSeleccionado: new FormControl('')
  })

  constructor() { }

  servicioFirebase = inject(FirebaseService);
  servicioUtilidades = inject(UtilsService)

  // *** Variables a utilizar ***
  usuarioID: string | null = null;
  visitante: string = '';
  local: string = '';
  esLocal: boolean = false;
  esVisitante: boolean = false;

  ngOnInit() {

    // this.usuario = this.servicioUtilidades.obtenerDeLocalStorage('usuario');
    this.obtenerUsuarioId()

    // Si existe la apuesta 'setea' los campos del formulario con los datos de la apuesta.
    if (this.apuesta) {
      this.form.setValue(this.apuesta);

      if (this.apuesta.strHomeTeam) {
        this.esLocal = true;
        this.esVisitante = false;
        this.form.controls.equipoSeleccionado.setValue(this.apuesta.strHomeTeam);
      } else if (this.apuesta.strAwayTeam) {
        this.esVisitante = true;
        this.esLocal = false;
        this.form.controls.equipoSeleccionado.setValue(this.apuesta.strAwayTeam);
      }

    } else if (this.evento) {
      this.form.controls.strAwayTeam.setValue(this.evento.strAwayTeam);
      this.form.controls.strHomeTeam.setValue(this.evento.strHomeTeam);
      this.visitante = this.evento.strAwayTeam;
      this.local = this.evento.strHomeTeam;
    }

  }

  // *********** Función para selección única de checkboxs ***********
  toggleCheckbox(tipo: 'local' | 'visitante') {
    if (tipo === 'local') {
      this.esLocal = !this.esLocal;
      this.esVisitante = false;
      this.form.controls.equipoSeleccionado.setValue(this.esLocal ? this.form.controls.strHomeTeam.value : '');
    } else {
      this.esVisitante = !this.esVisitante;
      this.esLocal = false;
      this.form.controls.equipoSeleccionado.setValue(this.esVisitante ? this.form.controls.strAwayTeam.value : '');
    }
  }

   // *********** Función para obtener el ID de usuario ***********
  async obtenerUsuarioId(): Promise<void> {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (usuario) => {
        if (usuario) {
          this.usuarioID = usuario.uid;
          resolve();
        } else {
          this.usuarioID = null;
          resolve();
        }
        console.log(this.usuarioID)
      });
    });
  }

  // *********** Función enviar() ***********
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
    let direccion = `usuario/${this.usuarioID}/apuestas`;

    // almacena en 'cargando' el metodo 'cargando()' de utils.service.ts
    const cargando = await this.servicioUtilidades.cargando();
    await cargando.present();

    delete this.form.value.id;

    const apuestaData = {
      nombre: this.form.controls.nombre.value,
      strLeague: this.form.controls.strLeague.value,
      strEvent: this.form.controls.strEvent.value,
      idEvent: this.form.controls.idEvent.value,
      strSport: this.form.controls.strSport.value,
      strTimestamp: this.form.controls.strTimestamp.value,
      strAwayTeam: this.form.controls.strAwayTeam.value,
      strHomeTeam: this.form.controls.strHomeTeam.value,
      importe: this.form.controls.importe.value,
      equipoSeleccionado: this.form.controls.equipoSeleccionado.value
    };

    // llama a la función crearApuesta() desde firebase.service.ts
    // se pasan como parametros la direccion en firebase de las apuestas del usuario y los valores del formulario
    this.servicioFirebase.crearApuesta(direccion, apuestaData).then(async respuesta => {

      // envia como parametro el nombre del usuario para actualizarlos en Firebase
      await this.servicioFirebase.actualizarUsuario(this.form.value.nombre);

      this.servicioUtilidades.guardarEnLocalStorage('apuesta', apuestaData);

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
    let direccion = `usuario/${this.usuarioID}/apuestas/${this.apuesta.id}`;

    // almacena en 'cargando' el metodo 'cargando()' de utils.service.ts
    const cargando = await this.servicioUtilidades.cargando();
    await cargando.present();

    delete this.form.value.id;

    const apuestaData = {
      nombre: this.form.controls.nombre.value,
      strLeague: this.form.controls.strLeague.value,
      strEvent: this.form.controls.strEvent.value,
      idEvent: this.form.controls.idEvent.value,
      strSport: this.form.controls.strSport.value,
      strTimestamp: this.form.controls.strTimestamp.value,
      strAwayTeam: this.esVisitante ? this.form.controls.strAwayTeam.value : this.form.controls.strHomeTeam.value,
      strHomeTeam: this.esLocal ? this.form.controls.strHomeTeam.value : this.form.controls.strAwayTeam.value,
      importe: this.form.controls.importe.value,
      equipoSeleccionado: this.form.controls.equipoSeleccionado.value
    };

    // llama a la función actualizarApuesta() desde firebase.service.ts
    // se pasan como parametros la direccion de las apuestas del usuario y los valores del formulario
    this.servicioFirebase.actualizarApuesta(direccion, apuestaData).then(async respuesta => {

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
