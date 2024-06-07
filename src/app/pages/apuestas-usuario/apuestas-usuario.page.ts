import { Component, OnInit, inject } from '@angular/core';
import { AgregarProductoComponent } from 'src/app/compartidos/agregar-producto/agregar-producto.component';
import { Apuesta } from 'src/app/models/apuesta.model';
import { Usuario } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-apuestas-usuario',
  templateUrl: './apuestas-usuario.page.html',
  styleUrls: ['./apuestas-usuario.page.scss'],
})
export class ApuestasUsuarioPage implements OnInit {

  servicioFirebase = inject(FirebaseService);
  utilidadesServ = inject(UtilsService);

  constructor() { }

  apuesta: Apuesta[] = [];

  ngOnInit() {
  }

  // Devuelve la URL de Firebase con los datos del usuario
  usuario(): Usuario {
    return this.utilidadesServ.obtenerDeLocalStorage('usuario');
  }

  ionViewWillEnter() {
    this.obtenerApuesta();
  }

  // *********** Obtener los apuestas del usuario ***********
  obtenerApuesta() {
    let direccion = `usuario/${this.usuario().usuarioID}/apuestas`;

    let subscribir = this.servicioFirebase.obtenerApuesta(direccion).subscribe({
      next: (respuesta: any) => {
        console.log(respuesta);
        this.apuesta = respuesta;
        subscribir.unsubscribe();
      }
    })
  }

  // *********** Agregar o actualizar los apuestas del usuario ***********
  async actualizarEditarApuesta(apuesta?: Apuesta) {
    let exitoso = await this.utilidadesServ.presentarModal({
      component: AgregarProductoComponent,
      cssClass: 'agregar-editar-modal',
      componentProps: { apuesta }
    })

    if (exitoso) this.obtenerApuesta();
  }

}
 