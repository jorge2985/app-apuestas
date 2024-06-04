import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() tipo!: string;
  @Input() etiqueta!: string;
  @Input() autocompletar!: string;
  @Input() icono!: string;

  esPassword!: boolean;
  oculta: boolean = true;

  constructor() { }

  ngOnInit() {
    if (this.tipo == 'password') this.esPassword = true;
  }

  mostrarOcultarPass() {
    this.oculta = !this.oculta;

    if (this.oculta) this.tipo = "password";
    else this.tipo = "text";
  }

}
