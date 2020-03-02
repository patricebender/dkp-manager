import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {PlayerClass} from '../models/PlayerClass';
import {Spec} from '../models/Spec';

import {OktaAuthService} from '@okta/okta-angular';
import {Player} from '../models/Player';

import {HttpClient} from '@angular/common/http';
import {Backend} from '../Backend';
import {Talent} from '../models/Talents';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
    private _talent: string;

    get spec(): Spec {
        return this._spec;
    }

    set spec(value: Spec) {
        this._spec = value;
    }

    get playerClass(): PlayerClass {
        return this._playerClass;
    }

    set playerClass(value: PlayerClass) {
        this._playerClass = value;
        this.spec = undefined;
        this.talent = undefined;
    }

    get playerClasses(): String[] {
        return Object.keys(PlayerClass);
    }


    get specs(): any[] {
        if (this._playerClass === PlayerClass.Druid) {
            if (this.talent === 'Feral') {
                return [Spec.Tank, Spec.DD];
            }
            if (this.talent === 'Restoration') {
                return [Spec.Heal];
            }
            return Object.keys(Spec);
        }

        if (this._playerClass === PlayerClass.Priest) {
            if (this.talent === 'Shadow') {
                return [Spec.DD];
            }
            return [Spec.Heal];
        }

        if (this._playerClass === PlayerClass.Shaman) {
            if (this.talent === 'Restoration') {
                return [Spec.Heal];
            }
            return [Spec.DD];
        }

        if (this.playerClass === PlayerClass.Warrior) {
            if (this.talent === 'Protection') {
                return [Spec.Tank];
            }
            return [Spec.Tank, Spec.DD];
        }
        return [Spec.DD];
    }


    @Input() player: Player;

    private _playerClass: PlayerClass;
    private _spec: Spec;

    constructor(private oktaAuth: OktaAuthService, private http: HttpClient
        , private toastController: ToastController,
                private modalController: ModalController
    ) {
    }

    ngOnInit() {
    }

    dismiss() {
        this.modalController.dismiss();
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }


    setPlayerClass(e) {
        this.playerClass = <PlayerClass> PlayerClass[e.detail.value];
    }

    setPlayerSpec(e) {
        this.spec = <Spec> Spec[e.detail.value];
    }

    logout() {
        this.oktaAuth.logout('/tabs');
    }

    get talent(): string {
        return this._talent;
    }

    set talent(value: string) {
        this._talent = value;
    }

    get talents(): any[] {
        return Talent(this.playerClass);
    }

    async postUser() {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);

        this.player.spec = this.spec;
        this.player.playerClass = this.playerClass;
        this.player.talent = this.talent;

        console.log(Backend.address + '/player');
        this.http.post(Backend.address + '/player', this.player, options)
            .subscribe((data) => {
                console.log('user creation successful!', data);
                this.dismiss();
                this.presentToast('Yeah ' + this.player.ingameName + ', dein Charakter wurde erstellt!');
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });
    }

    setPlayerTalent(e: CustomEvent) {
        this.talent = e.detail.value;
    }
}
