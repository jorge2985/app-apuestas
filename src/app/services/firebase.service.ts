import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { Usuario } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { setDoc, getFirestore, doc, getDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  autenticacion =  inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilServc = inject(UtilsService);

  constructor() { }

  // *********** AUTENTICACIÓN ***********

  obtenerAutenticacion() {
    return getAuth();
  }

  // *********** Logueo ***********
  // obtiene como parametros los datos enviados por el formulario y los valida con Firebase
  logueo(usuario: Usuario) {
    return signInWithEmailAndPassword(getAuth(), usuario.correo, usuario.password);
  }

  // *********** Registro ***********
  // obtiene como parametros los datos enviados por el formulario para crear un usuario en Firebase
  registroUsuario(usuario: Usuario) {
    return createUserWithEmailAndPassword(getAuth(), usuario.correo, usuario.password);
  }

  // *********** Actualizar usuario ***********
  // obtiene el nombre del usuario y actualiza los datos en la base de Firebase
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

  // *********** Actualiza el documento ***********
  // crea un documento con los datos del usuario, la 'dirección' es el path
  crearDocumento(direccion: string, data: any) {
    return setDoc(doc(getFirestore(), direccion), data);
  }

  // *********** Obtener el documento ***********
  // obtiene un documento con los datos del usuario
  async obtenerDocumento(direccion: string) {
    return (await getDoc(doc(getFirestore(), direccion))).data();
  }

}
