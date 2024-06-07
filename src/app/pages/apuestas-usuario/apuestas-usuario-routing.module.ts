import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApuestasUsuarioPage } from './apuestas-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ApuestasUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApuestasUsuarioPageRoutingModule {}
