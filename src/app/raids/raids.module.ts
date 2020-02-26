import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RaidsPageRoutingModule } from './raids-routing.module';

import { RaidsPage } from './raids.page';
import {TabsPageModule} from '../tabs/tabs.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RaidsPageRoutingModule,
        TabsPageModule
    ],
  declarations: [RaidsPage]
})
export class RaidsPageModule {}
