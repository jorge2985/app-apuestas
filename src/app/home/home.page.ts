import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { AgregarProductoComponent } from '../compartidos/agregar-producto/agregar-producto.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
  // en el array eventos se almacenan los datos de la API
  eventos: any[] = [];

  firebaseServ = inject(FirebaseService);
  utilidadesServ = inject(UtilsService);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchEventos();
  }

  // *********** Cerrar sesión ***********
  deslogueo() {
    this.firebaseServ.deslogueo();
  }

  // *********** Agregar o actualizar apuesta ***********
  agregarActApuesta() {
    this.utilidadesServ.presentarModal({
      component: AgregarProductoComponent,
    })
  }

  // obtiene y devuelve en el home los datos de la API
  fetchEventos() {
    const apiUrl = 'https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=&s=2023-2024'
    this.http.get(apiUrl).subscribe((data: any) => {
      const eventosFiltrados = data.event.filter(
        (evento: any) => evento.strStatus === 'Not Started' && evento.strSport === 'Soccer'
      );

      this.eventos = eventosFiltrados;
    });
  }
}
