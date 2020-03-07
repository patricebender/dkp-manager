import {Player} from './models/Player';
import {HttpHeaders} from '@angular/common/http';

import {OktaAuthService} from '@okta/okta-angular';
import {Observable} from 'rxjs';
import {Backend} from './Backend';
import {CreateUserComponent} from './create-user/create-user.component';
import {ModalController} from '@ionic/angular';

export class Settings {

    get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    set isAuthenticated(value: boolean) {
        this._isAuthenticated = value;
    }


    private static _instance: Settings;


    player: Player;
    private _isAuthenticated: boolean;

    private constructor() {}





    public static get Instance() {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}
