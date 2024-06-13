import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { Usuario } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { setDoc, getFirestore, doc, getDoc, addDoc, collection, collectionData, query, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage';
import { updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  autenticacion = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilServc = inject(UtilsService);

  constructor() { }

  // *********** AUTENTICACIÓN ***********

  obtenerAutenticacion() {
    return getAuth();
  }

  // *********** Logueo ***********
  // obtiene como parametros los datos enviados por el formulario y los valida con Firebase
  logueo(usuario: any) {
    return signInWithEmailAndPassword(getAuth(), usuario.correo, usuario.password);
  }

  // *********** Registro ***********
  // obtiene como parametros los datos enviados por el formulario para crear un usuario en Firebase
  registroUsuario(usuario: Usuario) {
    return createUserWithEmailAndPassword(getAuth(), usuario.correo, usuario.password);
  }

  // *********** Actualizar usuario ***********
  // envia como parametro el nombre del usuario para actualizarlos en Firebase
  actualizarUsuario(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // *********** Reenviar contraseña ***********
  recuperoCorreo(correo: string) {
    return sendPasswordResetEmail(getAuth(), correo);
  }

  // *********** Cerrar sesión ***********
  deslogueo() {
    getAuth().signOut();
    localStorage.removeItem('usuario');
    this.utilServc.linkEnrutador('/login');
  }


  // *********** BASE DE DATOS ***********

  // *********** Obtiene documento con datos de apuestas de una colección ***********
  obtenerApuesta(direccion: string, pedidoColeccion?: any) {
    const referencia = collection(getFirestore(), direccion);
    return collectionData(query(referencia, ...pedidoColeccion), { idField: 'id' });
  }

  // *********** Crea el documento con los datos del usuario ***********
  // crea un documento con los datos del usuario, la 'dirección' es el path
  crearDocumento(direccion: string, data: any) {
    return setDoc(doc(getFirestore(), direccion), data);
  }

  // *********** Actualiza el documento de la apuesta ***********
  // actualiza un documento ya existente en Firebase que contiene los datos de la apuesta
  actualizarApuesta(direccion: string, data: any) {
    return updateDoc(doc(getFirestore(), direccion), data);
  }

  // *********** Elimina el documento de la apuesta ***********
  // elimina un documento ya existente en Firebase que contiene los datos de la apuesta
  eliminarApuesta(direccion: string) {
    return deleteDoc(doc(getFirestore(), direccion));
  }

  // *********** Obtener el documento del usuario ***********
  // obtiene un documento con los datos del usuario
  async obtenerDocumento(direccion: string) {
    return (await getDoc(doc(getFirestore(), direccion))).data();
  }

  // *********** Creación del documento con la apuesta ***********
  // crea un documento con los datos de la apuesta. El ID lo crea la librería 'collection'
  crearApuesta(direccion: string, data: any) {
    return addDoc(collection(getFirestore(), direccion), data);
  }


  // *********** ALMACENAMIENTO ***********

  // *********** Subir imagen ***********
  // obtiene una dirección o path en la que se guardará la imagen en el sotrage
  // y se pasa la url para guardarla en la base de datos
  async subirImagen(direccion: string, data_url: string) {
    return uploadString(ref(getStorage(), direccion), data_url, 'data_url').then(() => {
      // cuando se termina de subir la imagen obtenemos la URL en la que guardó
      return getDownloadURL(ref(getStorage(), direccion))
    })
  }

}
