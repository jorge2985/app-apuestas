import { Component, Input, OnInit, inject } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title!: string;
  @Input() botonVolver!: string;
  @Input() esModal!: boolean;
  @Input() mostrarMenu!: boolean;

  constructor(private menuCtrl: MenuController) { }

  utilidadesServ = inject(UtilsService);

  ngOnInit() { }

  cierraModal() {
    this.utilidadesServ.cierraModal()
  }

}
