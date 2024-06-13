import { Component, OnInit, importProvidersFrom, inject } from '@angular/core';
import { AgregarProductoComponent } from 'src/app/compartidos/agregar-producto/agregar-producto.component';
import { Apuesta } from 'src/app/models/apuesta.model';
import { Usuario } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { orderBy } from 'firebase/firestore';
import { UsuarioService } from '../../services/usuario.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-apuestas-usuario',
  templateUrl: './apuestas-usuario.page.html',
  styleUrls: ['./apuestas-usuario.page.scss'],
})
export class ApuestasUsuarioPage implements OnInit {


  servicioFirebase = inject(FirebaseService);
  utilidadesServ = inject(UtilsService);
  datoUsuario = inject(UsuarioService);

  constructor() { }

  apuestas: Apuesta[] = [];
  cargando: boolean = false;


  ngOnInit() {

  }

  // Devuelve los datos del usuario guardados en el local Storage con la clave 'usuario'
  usuario(): Usuario {
    return this.utilidadesServ.obtenerDeLocalStorage('usuario');
  }

  ionViewWillEnter() {
    this.obtenerApuesta();
  }


  refrescar(evento) {
    setTimeout(() => {
      this.obtenerApuesta();
      evento.target.complete();
    }, 1000);
  }


  // *********** Obtener el total apostado ***********
  totalApostado() {
    return this.apuestas.reduce((indice, apuesta) => indice + apuesta.importe, 0);
  }


  // *********** Obtener el ID del usuario desde Firebase ***********
  /*
  async obtenerDatosUsuario() {
    const autenticado = this.servicioFirebase.obtenerAutenticacion();
    const usuarioActual = autenticado.currentUser;

    if (true) {
       const usuarioData: Usuario = {
        usuarioID: usuarioActual.uid,
        correo: usuarioActual.email,
        nombre: usuarioActual.displayName,
        password: '',
        imagen: ''
      } 

      this.datoUsuario.setearUsuario(usuarioActual);
      console.log(usuarioActual)
    } else {
      console.log('No hay usuario autenticado');
    }
  }
*/

  // *********** Obtener las apuestas del usuario ***********
  obtenerApuesta() {
    let direccion = `usuario/${this.usuario().usuarioID}/apuestas`;
    console.log(this.usuario().usuarioID)

    this.cargando = true;

    let peticion = [
      orderBy('importe', 'desc')
    ]

    let subscribir = this.servicioFirebase.obtenerApuesta(direccion, peticion).subscribe({
      next: (respuesta: any) => {
        this.apuestas = respuesta;

        this.cargando = false;

        subscribir.unsubscribe();
      }
    })
  }


  // *********** Actualiza la apuesta del usuario ***********
  async editarApuesta(apuesta?: Apuesta) {
    let exitoso = await this.utilidadesServ.presentarModal({
      component: AgregarProductoComponent,
      cssClass: 'agregar-editar-modal',
      componentProps: { apuesta }
    })

    if (exitoso) this.obtenerApuesta();
  }


  // *********** Confirma la eliminación de la apuesta del usuario ***********
  async confirmaEliminarProducto(apuesta: Apuesta) {
    this.utilidadesServ.mostrarAlerta({
      header: 'Eliminar apuesta',
      message: 'Quieres eliminar esta apuesta',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.eliminarApuesta(apuesta);
          }
        }
      ]
    })
  }


  // *********** Elimina la apuesta del usuario ***********
  // envía los datos editados en el componente para actualizar una apuesta
  async eliminarApuesta(apuesta: Apuesta) {

    // ruta que contiene las apuestas del usuario
    let direccion = `usuario/${this.usuario().usuarioID}/apuestas/${apuesta.id}`;

    // almacena en 'cargando' el metodo 'cargando()' de utils.service.ts
    const cargando = await this.utilidadesServ.cargando();
    await cargando.present();

    // llama a la función eliminarApuesta() desde firebase.service.ts
    // se pasa como parametro la direccion de las apuestas del usuario
    this.servicioFirebase.eliminarApuesta(direccion).then(async respuesta => {

      // refresca la página para que no se muestren las apuestas eliminadas
      this.apuestas = this.apuestas.filter(ap => ap.id !== apuesta.id)

      this.utilidadesServ.presentToast({
        message: 'Apuesta eliminada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    })

      // Devuelve mensaje de error si el usuario o la contraseña son incorrectos
      .catch(error => {
        console.error(`Hubo un error en la verificación de los datos ${error}`)

        // Cierra el elemento 'cargando'
      })
      .finally(() => {
        cargando.dismiss();
      })
  }

}
