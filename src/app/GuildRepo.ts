import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {OktaAuthService} from '@okta/okta-angular';
import {environment} from '../environments/environment';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {Player} from './models/Player';
import {Observable} from 'rxjs';
import {Backend} from './Backend';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class GuildRepo {
    private players: Player[];


    constructor(
        private oktaAuth: OktaAuthService,
        private http: HttpClient) {

    }

    async getPlayers(): Promise<Player[]> {
        const token = await this.oktaAuth.getAccessToken();
        const players = await this.http
            .get<any>(Backend.address + '/players', await Backend.getHttpOptions(token)).toPromise();
        return players.data;
    }



}
