import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuctionsPage } from './auctions.page';

const routes: Routes = [
  {
    path: '',
    component: AuctionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionsPageRoutingModule {}
