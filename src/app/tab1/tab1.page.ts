import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ListaService } from '../services/lista.service';
import { Lista } from '../models/lista.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public listaService: ListaService        // importamos el servicio ListaService que contiene las funciones crearLista() y guardarStorage()
  ) { }

  async AgregarApuesta() {
    let alerta = await this.alertController.create({
      header: "Agregar apuestas",
      inputs: [
        {
          type: "text",
          name: "titulo",
          placeholder: "Importe de la apuesta",
        },
        {
          type: "text",
          name: "descripcion",
          placeholder: "Descripción de la apuesta",
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel"
        },
        {
          text: "Agregar",
          handler: (data: any) => {
            let validado: boolean = this.ValidarIngreso(data);
            if (validado) {
              let creado = this.listaService.crearLista(data.titulo, data.descripcion);

              if (creado) {
                this.presentToast('Lista creada correctamente')
              }
            }
          }
        }
      ]
    })
    await alerta.present();
    console.log('Hola Mundo!');
  }

  ValidarIngreso(ingreso: any): boolean {
    if (ingreso && ingreso.titulo) {
      return true;
    }
    this.presentToast("Debe ingresar un valor");
    return false;
  }

  async presentToast(mensaje: string) {
    let toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });

    toast.present();

  }

  async EditarLista(lista: Lista) {
    let alerta = await this.alertController.create({
      header: "Editar lista",
      inputs: [
        {
          type: "text",
          name: "titulo",
          placeholder: "Ingrese el nuevo importe",
          value: lista.titulo
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel"
        },
        {
          text: "Editar",
          handler: (data: any) => {
            let validado: boolean = this.ValidarIngreso(data);
            if (validado) {
              lista.titulo = data.titulo,
              this.listaService.editarLista(lista);

              this.presentToast('Lista editada correctamente');
            }
          }
        }
      ]
    })
  }

  editarLista(listaItem: Lista) {
    this.EditarLista(listaItem)
  }

  eliminarLista(listaItem: Lista) {
    this.listaService.eliminarLista(listaItem);
    console.log("Se elimino la lista: ", listaItem);
  }

}
