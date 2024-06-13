import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {
  
  paginas = [
    { titulo: 'Inicio', url: '/home', icon: 'home-outline' },
    { titulo: 'Perfil', url: '/usuario-form', icon: 'person-outline' }
  ]

  rutas = inject(Router);
  servicioFirebase = inject(FirebaseService);
  utilidadesServ = inject(UtilsService);
  menuControl = inject(MenuController);

  dirreccionActual: string = '';

  constructor(private ruta: Router) { }

  ngOnInit() {
    this.rutas.events.subscribe((evento: any) => {
      if (evento?.url) this.dirreccionActual = evento.url;
    })
  }

  deslogueo() {
    this.servicioFirebase.deslogueo();
  }

  usuario(): Usuario {
    return this.utilidadesServ.obtenerDeLocalStorage('usuario');
  }

  async inicio() {
    await this.rutas.navigate(['/login']);
    await this.menuControl.close();
  }

  async perfil() {
    await this.rutas.navigate(['/usuario-form']);
    await this.menuControl.close();
  }

}