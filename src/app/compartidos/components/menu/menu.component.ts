import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MenuController } from '@ionic/angular';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  paginas = [
    { titulo: 'Inicio', url: '/home', icon: 'home-outline' },
    { titulo: 'Perfil', url: '/usuario-form', icon: 'person-outline' }
  ]

  rutas = inject(Router);
  servicioFirebase = inject(FirebaseService);
  utilidadesServ = inject(UtilsService);
  menuControl = inject(MenuController);

  dirreccionActual: string = '';

  user: any | null = null;

  constructor(private ruta: Router) { }

  ngOnInit() {
    this.rutas.events.subscribe((evento: any) => {
      if (evento?.url) this.dirreccionActual = evento.url;
    })

    this.getUserId()
  }

  // *********** Obtener el ID del usuario desde Firebase ***********
  // almacena en auth la respuesta de la función getAuth() y luego se la pasa como parámetro
  // a onAuthStateChanged para que devuelva el ID del usuario en Firebase.
  async getUserId(): Promise<void> {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user.displayName;
          resolve();
        } else {
          this.user = null;
          resolve();
        }
      });
    });
  }

  deslogueo() {
    this.servicioFirebase.deslogueo();
  }

/*   usuario(): Usuario {
    return this.utilidadesServ.obtenerDeLocalStorage('usuario');
  } */

  async inicio() {
    await this.rutas.navigate(['/login']);
    await this.menuControl.close();
  }

  async perfil() {
    await this.rutas.navigate(['/usuario-form']);
    await this.menuControl.close();
  }

}