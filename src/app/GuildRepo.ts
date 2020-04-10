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
    private players: Player[] = [];


    constructor(
        private oktaAuth: OktaAuthService,
        private http: HttpClient) {
        this.updatePlayers();
    }


    public getAllPlayers(){
        return this.players
    }




    async updatePlayers() {
        const token = await this.oktaAuth.getAccessToken();
        this.http
            .get(Backend.address + '/players', await Backend.getHttpOptions(token))
            .subscribe((res: any) => {
                this.players = res.data;
                console.log(this.players);
                console.log("YEAH Player aktualisiert")
            });
    }





}
