import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core'
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

export const autenticacionGuard: CanActivateFn = (route, state) => {

  const firebaseServ = inject(FirebaseService)
  const utilsServ = inject(UtilsService)

  // let usuario = localStorage.getItem('usuario')

  return new Promise((resolve, reject) => {
    firebaseServ.obtenerAutenticacion().onAuthStateChanged((autenticado) => {
      if (autenticado) {
        /* if (usuario) */ resolve(true);
      }
      else {
        firebaseServ.deslogueo();
        resolve(false);
      }
    })
  });
  
};
