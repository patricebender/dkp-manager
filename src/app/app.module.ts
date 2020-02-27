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
    declarations: [AppComponent, CreateUserComponent, ChangeUserComponent, CreateRaidComponent, EditUserComponent],
    entryComponents: [ChangeUserComponent,
        CreateUserComponent, CreateRaidComponent, EditUserComponent
    ],
    imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(),
        AppRoutingModule,
        OktaAuthModule.initAuth(environment.production ? config : devconfig),
        RouterModule.forRoot(appRoutes),
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})],
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
