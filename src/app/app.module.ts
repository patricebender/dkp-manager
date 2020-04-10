import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, Routes, RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';


import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';


import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {
    OktaAuthModule,
    OktaCallbackComponent,
} from '@okta/okta-angular';
import {CreateUserComponent} from './create-user/create-user.component';
import {ChangeUserComponent} from './change-user/change-user.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {CreateRaidComponent} from './create-raid/create-raid.component';
import {EditUserComponent} from './edit-user/edit-user.component';
import {DkpHistoryComponent} from './dkp-history/dkp-history.component';
import {RaidInfoComponent} from './raid-info/raid-info.component';
import {CreateAuctionComponent} from './create-auction/create-auction.component';
import {FormsModule} from '@angular/forms';
import {Bid} from './models/Bid';
import {BidComponent} from './bid/bid.component';
import {CloseAuctionComponent} from './close-auction/close-auction.component';



const config = {
    issuer: 'https://dev-181790.okta.com/oauth2/default',
    redirectUri: 'https://dkp-manager.firebaseapp.com/implicit/callback',
    clientId: '0oa2gduj6gvLnlHpd4x6',
    pkce: true
};

const devconfig = {
    issuer: 'https://dev-181790.okta.com/oauth2/default',
    redirectUri: 'http://localhost:8100/implicit/callback',
    clientId: '0oa2gduj6gvLnlHpd4x6',
    pkce: true
};


const appRoutes: Routes = [
    {
        path: 'implicit/callback',
        component: OktaCallbackComponent
    },
];


@NgModule({
    declarations: [AppComponent,
        CloseAuctionComponent,
        RaidInfoComponent,
        BidComponent,

        CreateAuctionComponent,
        CreateUserComponent, ChangeUserComponent, CreateRaidComponent, EditUserComponent, DkpHistoryComponent],
    entryComponents: [ChangeUserComponent,
        CloseAuctionComponent,
        RaidInfoComponent,
        BidComponent,
        CreateAuctionComponent,
        DkpHistoryComponent,
        CreateUserComponent, CreateRaidComponent, EditUserComponent
    ],
    imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(),
        AppRoutingModule,
        OktaAuthModule.initAuth(environment.production ? config : devconfig),
        RouterModule.forRoot(appRoutes),
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}), FormsModule],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    exports: [CreateUserComponent],

    bootstrap: [AppComponent]
})
export class AppModule {
}
