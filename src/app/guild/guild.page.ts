import {Component, OnInit} from '@angular/core';
import {Settings} from '../Settings';
import {ModalController} from '@ionic/angular';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Player} from '../models/Player';
import {Backend} from '../Backend';

@Component({
    selector: 'app-guild',
    templateUrl: './guild.page.html',
    styleUrls: ['./guild.page.scss'],
})
export class GuildPage implements OnInit {
    private filteredPlayers: any;

    constructor(
        private modalController: ModalController,
        private oktaAuth: OktaAuthService,
        private http: HttpClient) {
    }

    get MyChar() {
        return Settings.Instance.player;
    }

    players: Player[];
    searchTerm: string;

    async ngOnInit() {
        await this.updatePlayers();
    }


    public async updatePlayers() {
        const token = await this.oktaAuth.getAccessToken();
        const user = await this.oktaAuth.getUser();

        if (!token || !user) {
            this.oktaAuth.loginRedirect('/tabs');

        } else {
            let playerObservable = await this.getPlayerRequest(token);
            playerObservable
                .subscribe(
                    (res) => {
                        this.players = res.data;
                        this.filteredPlayers = this.players;
                        console.log(this.players);
                    },
                    (error) => {
                        const statusCode = error.status;
                        console.log('something went wrong ' + error);
                    }
                );
        }
    }

    private async getPlayerRequest(token): Promise<Observable<any>> {
        return this.http.get<Player>(Backend.address + '/players', await Backend.getHttpOptions(token));
    }

    setFilteredItems() {
        console.log(this.searchTerm);
        this.filteredPlayers = this.players.filter((player) => {
            const filter = this.searchTerm.toLowerCase();
            return player.ingameName.toLowerCase().startsWith(filter)
                || player.playerClass.toString().toLowerCase().startsWith(filter)
                || player.spec.toString().toLowerCase().startsWith(filter);
        });
    }

}
