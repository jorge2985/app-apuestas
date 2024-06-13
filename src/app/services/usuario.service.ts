import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  user: User | null = null;

  constructor() { }

  setearUsuario(user: User) {
    this.user = user
  }

  obtenerUsuario(): User | null {
    return this.user
  }

  /* private usuarioSubject = new BehaviorSubject<User | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  setUsuario(usuario: User | null) {
    this.usuarioSubject.next(usuario);
  }

  getUsuario(): User | null {
    return this.usuarioSubject.getValue();
  } */
}
