import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaidsPage } from './raids.page';
import {CreateUserComponent} from '../create-user/create-user.component';

const routes: Routes = [
  {
    path: '',
    component: RaidsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaidsPageRoutingModule {}
