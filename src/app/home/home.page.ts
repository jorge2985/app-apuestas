import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
  eventos: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchEventos();
  }

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
