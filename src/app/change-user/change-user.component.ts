import {Component, Input, OnInit} from '@angular/core';
import {Spec} from '../models/Spec';
import {PlayerClass} from '../models/PlayerClass';
import {Talent} from '../models/Talents';
import {ModalController, ToastController, NavController} from '@ionic/angular';
import {Player} from '../models/Player';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {Backend} from '../Backend';
import {Settings} from '../Settings';
import {Observable} from 'rxjs';
import {PlayerWidgetComponent} from '../player-widget/player-widget.component';


@Component({
    selector: 'app-change-user',
    templateUrl: './change-user.component.html',
    styleUrls: ['./change-user.component.scss'],
})
export class ChangeUserComponent implements OnInit {
    get talent(): string {
        return this._talent;
    }

    set talent(value: string) {
        this._talent = value;
    }


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


    get talents(): any[] {
        return Talent(this.playerClass);
    }



    get specs(): any[] {
        if (this._playerClass === PlayerClass.Druid
            || this._playerClass === PlayerClass.Paladin) {
            return Object.keys(Spec);
        }

        if (this._playerClass === PlayerClass.Priest
            || this._playerClass === PlayerClass.Shaman) {
            return [Spec.Heal, Spec.DD];
        }

        if(this.playerClass === PlayerClass.Warrior) {
            return [Spec.Tank, Spec.DD];
        }
        return [Spec.DD];
    }


    @Input() player: Player;

    private _playerClass: PlayerClass;
    private _spec: Spec;
    private _talent: string;

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


    async patchUser() {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);

        this.player.spec = this.spec;
        this.player.playerClass = this.playerClass;
        this.player.talent = this.talent.toLowerCase();
        this.http.patch(Backend.address + '/player', this.player, options)
            .subscribe((data) => {
                console.log('user update successful!', data);
                this.presentToast('Yeah ' + this.player.ingameName + ', dein Charakter wurde aktualisiert!');
                this.dismiss();
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });
    }

    setPlayerTalent(e: CustomEvent) {
        this.talent = e.detail.value;
    }
}
