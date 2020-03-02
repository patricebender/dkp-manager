import {Component, OnInit} from '@angular/core';
import {Settings} from '../Settings';
import {ModalController} from '@ionic/angular';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Player} from '../models/Player';
import {Backend} from '../Backend';
import {CreateRaidComponent} from '../create-raid/create-raid.component';
import {EditUserComponent} from '../edit-user/edit-user.component';
import {DkpHistoryComponent} from '../dkp-history/dkp-history.component';

@Component({
    selector: 'app-guild',
    templateUrl: './guild.page.html',
    styleUrls: ['./guild.page.scss'],
})
export class GuildPage implements OnInit {
    private isModalPresent: boolean;
    get filteredPlayers(): Player[] {
        return this._filteredPlayers;
    }

    set filteredPlayers(value: Player[]) {
        this._filteredPlayers = value;
    }

    private _filteredPlayers: Player[];

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
            this.oktaAuth.loginRedirect('/tabs/guild');

        } else {
            let playerObservable = await this.getPlayersRequest(token);
            playerObservable
                .subscribe(
                    (res) => {
                        this.players = res.data;
                        this._filteredPlayers = this.players;
                        console.log(this.players);
                    },
                    (error) => {
                        const statusCode = error.status;
                        console.log('something went wrong ' + error);
                    }
                );
        }
    }

    private async getPlayersRequest(token): Promise<Observable<any>> {
        return this.http.get<Player>(Backend.address + '/players', await Backend.getHttpOptions(token));
    }

    setFilteredItems() {
        this._filteredPlayers = this.players.filter((player) => {
            const filter = this.searchTerm.toLowerCase();
            return player.ingameName.toLowerCase().startsWith(filter)
                || player.playerClass.toString().toLowerCase().startsWith(filter)
                || player.spec.toString().toLowerCase().startsWith(filter)
                || player.talent.toString().toLowerCase().startsWith(filter);
        });
    }

    async showEditUserModal(player) {

        if (this.isModalPresent) {
            return;
        }
        this.isModalPresent = true;
        const modal = await this.modalController.create({
            component: EditUserComponent,
            componentProps: {
                player
            }
        });
        await modal.present();
        modal.onDidDismiss().then((callback) => {
            this.updatePlayers();
            this.isModalPresent = false;
        });
    }

    async showDkpHistory(player) {
        if (this.isModalPresent) {
            return;
        }
        this.isModalPresent = true;
        const modal = await this.modalController.create({
            component: DkpHistoryComponent,
            componentProps: {
                player
            }
        });
        await modal.present();
        modal.onDidDismiss().then((callback) => {
            this.isModalPresent = false;
        });
    }
}
