import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReseteoPageRoutingModule } from './reseteo-routing.module';

import { ReseteoPage } from './reseteo.page';
import { CompartidosModule } from '../../compartidos/compartidos.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReseteoPageRoutingModule,
    CompartidosModule
  ],
  declarations: [ReseteoPage]
})
export class ReseteoPageModule {}
