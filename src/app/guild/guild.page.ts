import {Component, OnInit} from '@angular/core';
import {Settings} from '../Settings';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Player} from '../models/Player';
import {Backend} from '../Backend';
import {CreateRaidComponent} from '../create-raid/create-raid.component';
import {EditUserComponent} from '../edit-user/edit-user.component';
import {DkpHistoryComponent} from '../dkp-history/dkp-history.component';
import {PlayerClass} from '../models/PlayerClass';
import {Raid} from '../models/Raid';

@Component({
    selector: 'app-guild',
    templateUrl: './guild.page.html',
    styleUrls: ['./guild.page.scss'],
})
export class GuildPage implements OnInit {
    private isModalPresent: boolean;
    private isDkpSortAscending: boolean = true;


    get filteredPlayers(): Player[] {
        if (this.isDkpSortAscending) {
            return this._filteredPlayers.sort((a, b) => a.dkp > b.dkp ? -1 : a.dkp < b.dkp ? 1 : 0);
        }
        return this._filteredPlayers.sort((a, b) => a.dkp > b.dkp ? 1 : a.dkp < b.dkp ? -1 : 0);
    }

    set filteredPlayers(value: Player[]) {
        this._filteredPlayers = value;
    }

    private _filteredPlayers: Player[] = [];
    players: Player[] = [];
    searchTerm: string = "";

    constructor(private alertController: AlertController,
                private toastController: ToastController,
                private modalController: ModalController,
                private oktaAuth: OktaAuthService,
                private http: HttpClient) {
    }

    get myChar() {
        return Settings.Instance.player;
    }

    get allClasses() {
        return Object.keys(PlayerClass);
    }

    findAllPlayersOfOneClass(playerClassString: string) {
        const playerClass = PlayerClass[playerClassString];
        return this.players.filter((p) => {
            return p.playerClass === playerClass;
        });
    }

    async presentDeleteConfirm(player: Player) {
        console.log(player + ' wird gelöscht');
        const alert = await this.alertController.create({
            header: player.ingameName + ' Löschen?',
            message: 'Bist du dir Sicher, dass du den Spieler inklusive DKP löschen möchtest?',
            buttons: [
                {
                    text: 'Löschen',
                    handler: () => {
                        this.deleteUser(player);
                    }
                },
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: this.myChar.playerClass.toString().toLowerCase(),
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }
            ]
        });

        await alert.present();
    }

    async deleteUser(player: Player) {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);
        console.log(player);

        this.http.delete(Backend.address + '/player/' + player._id, options)
            .subscribe((data) => {
                console.log('raid cancelled!', data);
                this.updatePlayers();
                this.presentToast('Spieler gelöscht!');
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });
    }


    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }


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
                        this._filteredPlayers = this.getFilteredPlayers();
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

    getFilteredPlayers() {
        return this.players.filter((player) => {
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
            this.updatePlayers();
        });
    }

    swapDkpSort() {
        this.isDkpSortAscending = !this.isDkpSortAscending;
    }
}
