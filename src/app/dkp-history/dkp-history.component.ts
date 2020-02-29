import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../models/Player';
import {DkpLogType} from '../models/DkpLogType';
import {ModalController, ToastController} from '@ionic/angular';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Backend} from '../Backend';
import {DkpEntry} from '../models/DkpEntry';
import {Settings} from '../Settings';

@Component({
    selector: 'app-dkp-history',
    templateUrl: './dkp-history.component.html',
    styleUrls: ['./dkp-history.component.scss'],
})
export class DkpHistoryComponent implements OnInit {

    constructor(
        private modalController: ModalController,
        private oktaAuth: OktaAuthService,
        private http: HttpClient,
        private toastController: ToastController) {
    }

    @Input() player: Player;

    entries: DkpEntry[];

    get myChar() {
        return Settings.Instance.player;
    }

    async ngOnInit() {
        await this.updateEntries();
    }

    private async updateEntries() {
        const token = await this.oktaAuth.getAccessToken();
        const user = await this.oktaAuth.getUser();

        if (!token || !user) {
            this.oktaAuth.loginRedirect('/tabs/guild');

        } else {
            let playerObservable = await this.getPlayersRequest(token);
            playerObservable
                .subscribe(
                    (res) => {
                        this.entries = res.data;
                        console.log(this.entries, res);
                    },
                    (error) => {
                        console.log(error)
                        this.presentToast("etwas ist schiefgelaufen 🤮")
                    }
                );
        }
    }


    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

    private async getPlayersRequest(token): Promise<Observable<any>> {
        return this.http.get<Player>(Backend.address + '/dkp/history' + this.player.mail, await Backend.getHttpOptions(token));
    }

}
