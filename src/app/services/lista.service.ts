import { Injectable } from '@angular/core';
import { Lista } from '../models/lista.model';

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  public listas:Lista[] = []    // Almacena las apuestas

  constructor() {
    this.cargarStorage();
   }

  crearLista(nombreLista:string, descripcionLista: string) {

    // Creamos un objeto en base a la clase Lista
    let objetoLista = new Lista(nombreLista, descripcionLista);

    this.listas.push(objetoLista);        // Ingresa en el array de listas el objeto creado con los datos.
    this.guardarStorage();

    return [objetoLista.titulo, objetoLista.descripcion];
  }

  guardarStorage() {
    let cadenaListas: string = JSON.stringify(this.listas)   // Convierte el array `listas` en texto plano
    localStorage.setItem('listas', cadenaListas)             // Se ingresan dos parámetros, nombre y contenido
  }

  // función para evitar que se pierdan los datos almacenados en el storage
  cargarStorage() {
    const listaStorage = localStorage.getItem('listas')     // Ingresamos como parámetro el nombre del objeto a recuperar
    
    if (listaStorage === null) {
      return this.listas = [];                              // Si el objeto `listaSotrage` es nulo devolvemos la lista vacia
    } else {
      let objLista = JSON.parse(listaStorage);              // Convierte el texto plano a objeto para ingresarlo
      return this.listas = objLista;
    }

  }

  eliminarLista(lista: Lista) {
    let nuevoListado = this.listas.filter((items) => items.id !== lista.id);    // Guarda la lista sin la elegida en una variable
    this.listas = nuevoListado;

    this.guardarStorage();
  }

  editarLista(lista: Lista) {
    let listaEditada: any = this.listas.find((item) => item.id == lista.id)        // Guarda el item elegido en una variable.
    listaEditada.titulo = lista.titulo

    this.guardarStorage();
  }

}
