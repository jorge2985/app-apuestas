import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core'
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

export const noAutenticadoGuard: CanActivateFn = (route, state) => {

  const firebaseServ = inject(FirebaseService)
  const utilsServ = inject(UtilsService)

  return new Promise((resolve, reject) => {
    firebaseServ.obtenerAutenticacion().onAuthStateChanged((autenticado) => {
      if (!autenticado) resolve(true)
      else {
        utilsServ.linkEnrutador('/home');
        resolve(false);
      }
    })
  });

};
