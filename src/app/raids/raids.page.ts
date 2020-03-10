import {Component, OnInit} from '@angular/core';
import {Settings} from '../Settings';
import {Observable} from 'rxjs';
import {Player} from '../models/Player';
import {Backend} from '../Backend';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {Raid} from '../models/Raid';
import {ModalController} from '@ionic/angular';
import {CreateRaidComponent} from '../create-raid/create-raid.component';
import {ToastController} from '@ionic/angular';
import {AlertController} from '@ionic/angular';
import {DkpLogType} from '../models/DkpLogType';
import {DkpEntry} from '../models/DkpEntry';
import {RaidInfoComponent} from '../raid-info/raid-info.component';

@Component({
    selector: 'app-raids',
    templateUrl: './raids.page.html',
    styleUrls: ['./raids.page.scss'],
})
export class RaidsPage implements OnInit {
    private isModalPresent: any;
    raids: Raid[];
    status: string[] = [];


    get myChar(): Player {
        return Settings.Instance.player;
    }


    constructor(
        private modalController: ModalController,
        private oktaAuth: OktaAuthService,
        private http: HttpClient,
        private toastController: ToastController,
        private alertController: AlertController) {
    }

    ngOnInit() {
        console.log('RAIDS ENTERED');
    }


    async ionViewDidEnter() {
        await this.updateRaids();
    }

    private async updateRaids() {
        let raidObs = await this.getRaids();
        raidObs
            .subscribe(
                (res) => {
                    const raids = res.data;
                    this.raids = raids;
                },
                (error) => {
                    const statusCode = error.status;
                    if (statusCode === 404) {
                        console.log('nix gefunden');
                    }
                    if (statusCode === 500) {
                        console.log('something went wrong ' + error);
                    }

                }
            );
    }

    async showCreateRaidModal() {
        if (this.isModalPresent) {
            return;
        }
        this.isModalPresent = true;
        const modal = await this.modalController.create({
            component: CreateRaidComponent,
            componentProps: {}
        });
        await modal.present();
        modal.onDidDismiss().then((callback) => {
            if (callback.data) {
                const raid: Raid = callback.data.raid;
                this.postRaid(raid);
            }
            this.updateRaids();
            this.isModalPresent = false;
        });
    }
    async showChangeRaidModal(raid: Raid) {
        if (this.isModalPresent) {
            return;
        }
        this.isModalPresent = true;
        const modal = await this.modalController.create({
            component: CreateRaidComponent,
            componentProps: {
                existingRaid: raid
            }
        });
        await modal.present();
        modal.onDidDismiss().then((callback) => {
            if (callback.data) {
                const raid: Raid = callback.data.raid;
                const isUpdate = callback.data.isUpdate;
                isUpdate ? this.patchRaid(raid) : this.postRaid(raid);
            }
            this.updateRaids();
            this.isModalPresent = false;
        });
    }


    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }
    private async patchRaid(raid: Raid) {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);

        this.http.patch(Backend.address + '/raid', raid, options)
            .subscribe((data) => {
                console.log('raid change successful!', data);
                this.updateRaids();
                this.presentToast('Yeah der Raid wurde geändert!');
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });

    }

    private async postRaid(raid: Raid) {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);

        this.http.post(Backend.address + '/raid', raid, options)
            .subscribe((data) => {
                console.log('raid creation successful!', data);
                this.updateRaids();
                this.presentToast('Yeah der Raid wurde erstellt!');
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });

    }

    private async getRaids(): Promise<Observable<any>> {
        const token = await this.oktaAuth.getAccessToken();
        return this.http.get<Raid>(Backend.address + '/raids', await Backend.getHttpOptions(token));
    }


    async presentDeleteConfirm(raid: Raid) {
        const alert = await this.alertController.create({
            header: 'Raid Löschen?',
            message: 'Bist du dir Sicher, dass du den Raid Absagen möchtest?',
            buttons: [
                {
                    text: 'Löschen',
                    handler: () => {
                        this.cancelRaid(raid);
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

    async presentRaidRegistration(raid: Raid) {
        console.log(raid);
        const alert = await this.alertController.create({
            header: 'Anmeldung +5 DKP',
            inputs: [
                {
                    name: 'confirm',
                    type: 'radio',
                    label: '✅ Zusage',
                    value: 'confirm',
                },
                {
                    name: 'decline',
                    type: 'radio',
                    label: '❌ Absage',
                    value: 'decline'
                },
                {
                    name: 'bench',
                    type: 'radio',
                    label: '🪑 Ersatzbank',
                    value: 'bench'
                },
                {
                    name: 'late',
                    type: 'radio',
                    label: '⌛️ Verspätung',
                    value: 'late'
                }
            ],
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: '',
                    handler: () => {
                        console.log(raid);
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Abschicken',

                    handler: (data) => {
                        if (data) {
                            this.registerForRaid(raid, data);
                        } else {
                            this.presentToast('Du musst schon etwas auswählen 😜');
                            return false;
                        }

                    }
                }
            ]
        });

        await alert.present();
    }

    async registerForRaid(raid: Raid, registrationType: string) {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);

        const body = {raid, player: this.myChar, registrationType};

        this.http.patch(Backend.address + '/raid/register', body, options)
            .subscribe((data) => {
                console.log('registration success', data);
                this.http.patch(Backend.address + '/raid/register', body, options);
                if (this.isAlreadyRegistered(raid)) {
                    this.presentToast('Registrierung erfolgreich geändert');
                } else {
                    this.presentToast('Danke fürs registrieren!');
                    //this.createAndPostDkpEntry(5, "Raidanmeldung");
                }
                this.updateRaids();

            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });
    }

    async cancelRaid(raid: Raid) {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);


        this.http.delete(Backend.address + '/raid/' + raid._id, options)
            .subscribe((data) => {
                console.log('raid cancelled!', data);
                this.updateRaids();
                this.presentToast('Raid gelöscht!');
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });
    }

    async createAndPostDkpEntry(dkp: number, reason: string) {
        const dkpLogType = dkp > 0 ? DkpLogType.Bonus : DkpLogType.Penalty;
        const dkpEntry = new DkpEntry(dkpLogType, reason, this.myChar.ingameName, new Date(), dkp, this.myChar.mail);
        this.postDkpEntry(dkpEntry);
    }

    async postDkpEntry(dkpEntry: DkpEntry) {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);

        this.http.patch(Backend.address + '/dkp/' + this.myChar.mail, dkpEntry, options)
            .subscribe((data) => {
                console.log('dkp patch successful!', data);
                this.presentToast('Danke für deine Registrierung! +5 DKP!');
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });
    }

    isAlreadyRegistered(raid: Raid): boolean {
        return raid.confirm.some(reg => reg.player.mail === this.myChar.mail)
            || raid.bench.some(reg => reg.player.mail === this.myChar.mail)
            || raid.late.some(reg => reg.player.mail === this.myChar.mail)
            || raid.decline.some(reg => reg.player.mail === this.myChar.mail);
    }

    getConfirmed(raid: Raid): Player[] {
        return raid.confirm;
    }

    getDeclined(raid: Raid): Player[] {
        return raid.decline;
    }

    getBench(raid: Raid): Player[] {
        return raid.bench;
    }

    getLate(raid: Raid): Player[] {
        return raid.late;
    }

    async showRaidInfo(raid: Raid) {
        if (this.isModalPresent) {
            return;
        }
        console.log();
        this.isModalPresent = true;
        const modal = await this.modalController.create({
            component: RaidInfoComponent,
            cssClass: 'my-custom-modal-css',
            componentProps: {
                raid: raid
            }
        });
        await modal.present();
        modal.onDidDismiss().then(() => {
            this.updateRaids();
            this.isModalPresent = false;
        });
    }

    getInviteOrPullTime(raid: Raid, getInvTime: boolean) {
        let pullTime = new Date(raid.date);
        const invTime = new Date(pullTime);
        invTime.setMinutes(pullTime.getMinutes() - 30);

        return getInvTime ? invTime.getHours() + ':' + invTime.getMinutes() :
            pullTime.getHours() + ':' + pullTime.getMinutes();
    }
}
