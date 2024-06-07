import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApuestasUsuarioPageRoutingModule } from './apuestas-usuario-routing.module';

import { ApuestasUsuarioPage } from './apuestas-usuario.page';
import { CompartidosModule } from 'src/app/compartidos/compartidos.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApuestasUsuarioPageRoutingModule,
    CompartidosModule
  ],
  declarations: [ApuestasUsuarioPage]
})
export class ApuestasUsuarioPageModule {}
