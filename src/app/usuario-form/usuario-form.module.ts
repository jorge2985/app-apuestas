import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuarioFormPageRoutingModule } from './usuario-form-routing.module';

import { UsuarioFormPage } from './usuario-form.page';
import { CompartidosModule } from '../compartidos/compartidos.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuarioFormPageRoutingModule,
    CompartidosModule
  ],
  declarations: [UsuarioFormPage]
})
export class UsuarioFormPageModule {}
