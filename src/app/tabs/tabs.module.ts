import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import {PlayerWidgetComponent} from '../player-widget/player-widget.component';
import {CreateUserComponent} from '../create-user/create-user.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TabsPageRoutingModule
    ],
    exports: [
        PlayerWidgetComponent,
    ],
    declarations: [TabsPage, PlayerWidgetComponent]
})
export class TabsPageModule {}
