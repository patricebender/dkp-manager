import {Component, HostListener, Input, OnInit} from '@angular/core';
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
    get entries(): DkpEntry[] {
        return this._entries;
    }

    set entries(value: DkpEntry[]) {
        this._entries = value;
    }

    constructor(
        private modalController: ModalController,
        private oktaAuth: OktaAuthService,
        private http: HttpClient,
        private toastController: ToastController) {
    }

    get DkpLogType() {
        return DkpLogType;
    }

    @Input() player: Player;

    private _entries: DkpEntry[] = [];
    private skip: number = 0;
    private isAllLogsLoaded: boolean;



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
            let dkpLogObservable = await this.getDkpLogs(token);
            dkpLogObservable
                .subscribe(
                    (res) => {
                        if (res.data.length === 0){
                            this.isAllLogsLoaded = true;
                        }else {
                            this.skip += 10;
                            this._entries.push(...res.data);
                        }

                    },
                    (error) => {
                        console.log(error);
                        this.presentToast('etwas ist schiefgelaufen 🤮');
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

    private async getDkpLogs(token): Promise<Observable<any>> {
        return this.http.get(Backend.address + '/dkp/history/' + this.player.mail + "/"+ this.skip, await Backend.getHttpOptions(token));
    }

    deleteEntry(entry: DkpEntry) {
        const dkpLog = new DkpEntry(DkpLogType.Correction, 'Korrektur von: ' + entry.dkpLogType, this.myChar.ingameName, new Date(), -entry.dkp, this.player.mail);
        this.postDkpEntry(dkpLog);

    }


    loadData(event) {
        setTimeout(() => {
            event.target.complete();
            this.updateEntries();
            // disable the infinite scroll
            if (this.isAllLogsLoaded) {
                event.target.disabled = true;
            }
        }, 500);
    }

    async postDkpEntry(dkpEntry: DkpEntry) {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);

        this.http.patch(Backend.address + '/dkp/' + this.player.mail, dkpEntry, options)
            .subscribe((data) => {
                console.log('dkp patch successful!', data);
                this.presentToast('DKP Update Erfolgreich!');
                this.updateEntries();
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });
    }
}
