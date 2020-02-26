import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {PlayerClass} from '../models/PlayerClass';
import {Spec} from '../models/Spec';

import {OktaAuthService} from '@okta/okta-angular';
import {Player} from '../models/Player';

import {HttpClient} from '@angular/common/http';
import {Backend} from '../Backend';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
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
    }

    get playerClasses(): String[] {
        return Object.keys(PlayerClass);
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
        return [Spec.DD];
    }


    @Input() modalController: ModalController;
    @Input() player: Player;

    private _playerClass: PlayerClass;
    private _spec: Spec;

    constructor(private oktaAuth: OktaAuthService, private http: HttpClient) {
    }

    ngOnInit() {
    }

    dismiss() {
        this.modalController.dismiss({
            'dismissed': true
        });
    }

    setPlayerClass(e) {
        this._playerClass = <PlayerClass> PlayerClass[e.detail.value];
    }

    setPlayerSpec(e) {
        this.spec = <Spec> Spec[e.detail.value];
    }

    logout(){
        this.oktaAuth.logout("/tabs")
    }


    async postUser() {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);

        this.player.spec = this.spec;
        this.player.playerClass = this.playerClass;

        this.http.post(Backend.address + '/player', this.player, options)
            .subscribe((data) => {
                console.log(data);
            }, (e) => {
                console.log(e);
            });
    }
}
