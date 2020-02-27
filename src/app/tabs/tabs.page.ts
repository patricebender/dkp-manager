import {Component} from '@angular/core';
import {Settings} from '../Settings';
import {AlertController, LoadingController} from '@ionic/angular';
import {OktaAuthService} from '@okta/okta-angular';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Backend} from '../Backend';


@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {
    get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    set isAuthenticated(value: boolean) {
        this._isAuthenticated = value;
    }
    private _isAuthenticated: boolean;
    get player(){
        return Settings.Instance.player;
    }

    constructor(
        public http: HttpClient,
        private oktaAuth: OktaAuthService) {
        this.oktaAuth.$authenticationState.subscribe(
            (isAuthenticated: boolean) => {
                this._isAuthenticated = isAuthenticated;
                if (!this._isAuthenticated) {
                    this.oktaAuth.loginRedirect('/tabs/raids');
                }
            }
        );
    }

    async ngOnInit() {
        this._isAuthenticated = await this.oktaAuth.isAuthenticated();
    }

    logout() {
        Settings.Instance.player = null;
        this.oktaAuth.logout('/tabs/raids');
    }


}
