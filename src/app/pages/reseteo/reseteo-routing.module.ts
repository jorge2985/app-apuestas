import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReseteoPage } from './reseteo.page';

const routes: Routes = [
  {
    path: '',
    component: ReseteoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReseteoPageRoutingModule {}
