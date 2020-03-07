import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuctionsPageRoutingModule } from './auctions-routing.module';

import { AuctionsPage } from './auctions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuctionsPageRoutingModule
  ],
  declarations: [AuctionsPage]
})
export class AuctionsPageModule {}
