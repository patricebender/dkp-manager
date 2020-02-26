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

const config = {
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
    declarations: [AppComponent, CreateUserComponent],
    entryComponents: [
CreateUserComponent
    ],
    imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(),
        AppRoutingModule,
        OktaAuthModule.initAuth(config),
        RouterModule.forRoot(appRoutes)],
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
