import {Component, OnInit} from '@angular/core';
import {Player} from '../models/Player';
import {Settings} from '../Settings';
import {CreateUserComponent} from '../create-user/create-user.component';
import {Observable} from 'rxjs';
import {Backend} from '../Backend';
import {ModalController, ToastController} from '@ionic/angular';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {ChangeUserComponent} from '../change-user/change-user.component';
import {max} from 'rxjs/operators';

@Component({
    selector: 'app-player-widget',
    templateUrl: './player-widget.component.html',
    styleUrls: ['./player-widget.component.scss'],
})
export class PlayerWidgetComponent implements OnInit {
    private isModalPresent: boolean;


    get player(): Player {
        return Settings.Instance.player;
    }


    constructor(
        private modalController: ModalController,
        private oktaAuth: OktaAuthService,
        private toastController: ToastController,
        private http: HttpClient) {
    }

    async ngOnInit() {
        await this.updatePlayer();
        this.StartTimer();
    }

    refreshTime: number = 4;

    StartTimer() {
        setTimeout(() => {
            if (this.refreshTime === 0) {
                this.updatePlayer();
                this.refreshTime = 4;
            }else{
                this.refreshTime -= 1;
            }
            this.StartTimer();

        }, 1000);
    }

    public async updatePlayer() {
        const token = await this.oktaAuth.getAccessToken();
        const user = await this.oktaAuth.getUser();

        if (!token || !user) {
            this.oktaAuth.loginRedirect('/tabs/guild');

        } else {
            let playerObservable = await this.getPlayerRequest(user, token);
            playerObservable
                .subscribe(
                    (res) => {
                        const player = res.player;
                        Settings.Instance.player = player;
                    },
                    (error) => {
                        const statusCode = error.status;
                        if (statusCode === 404) {
                            this.showCreateProfileModal();
                        }
                        if (statusCode === 500) {
                            console.log('something went wrong ' + error);
                        }

                    }
                );
        }
    }

    private async getPlayerRequest(user, token): Promise<Observable<any>> {
        return this.http.get<Player>(Backend.address + '/player/' + user.mail, await Backend.getHttpOptions(token));
    }

    async showCreateProfileModal() {
        if (this.isModalPresent) {
            return;
        }
        const modal = await this.modalController.create({
            component: CreateUserComponent,
            componentProps: {
                'player': await this.oktaAuth.getUser()
            }
        });
        await modal.present();
        this.isModalPresent = true;
        modal.onDidDismiss().then(() => {
            this.updatePlayer();
            this.isModalPresent = false;
        });
    }


    async showChangeUserModal() {
        if (this.isModalPresent) {
            return;
        }
        this.isModalPresent = true;
        const modal = await this.modalController.create({
            component: ChangeUserComponent,
            componentProps: {
                'player': await this.oktaAuth.getUser(),
            }
        });
        await modal.present();
        modal.onDidDismiss().then(() => {
            this.updatePlayer();
            this.isModalPresent = false;
        });
    }

    async updatePlayerLanguage() {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);

        this.http.patch(Backend.address + '/player', this.player, options)
            .subscribe((data) => {
                console.log('user update successful!', data);
                this.presentToast('Yeah ' + this.player.ingameName + ', deine Spracheinstellung wurde aktualisiert!');
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


}
