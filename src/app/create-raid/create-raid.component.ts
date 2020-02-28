import {Component, OnInit} from '@angular/core';
import {Player} from '../models/Player';
import {PlayerClass} from '../models/PlayerClass';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {ModalController, ToastController} from '@ionic/angular';
import {Raid} from '../models/Raid';
import {Settings} from '../Settings';

@Component({
    selector: 'app-create-raid',
    templateUrl: './create-raid.component.html',
    styleUrls: ['./create-raid.component.scss'],
})
export class CreateRaidComponent implements OnInit {
    duration: number = 4;
    dungeonName: string;
    date: Date = new Date();
    registrationDeadline: Date;
    description: string;
    playerLimit: number = 40;

    get dungeonNames(): string[] {
        return this._dungeonNames;
    }

    get player(): Player {
        return Settings.Instance.player;
    }


    constructor(private oktaAuth: OktaAuthService,
                private http: HttpClient,
                private toastController: ToastController,
                private modalController: ModalController
    ) {
    }

    dismiss() {
        this.modalController.dismiss({
            raid: new Raid(this.dungeonName, this.date, this.date, this.description)
        });
    }


    private _dungeonNames: string[] = [
        'Molten Core',
        'Blackwing Lair'
    ];


    get now() {
        const now = new Date();
        return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDay();
    }

    isValidRaid() {
        return this.description && this.dungeonName && this.playerLimit && this.duration;
    }


    ngOnInit() {
    }

    setDungeonName(e: CustomEvent) {
        this.dungeonName = e.detail.value;
    }

    setPlayerLimit(e: CustomEvent) {
        this.playerLimit = e.detail.value;
    }

    setDate(e: CustomEvent) {
        this.date = e.detail.value;
    }

    setDuration(e: CustomEvent) {
        this.duration = e.detail.value;
    }

    setDescription(e: CustomEvent) {
        this.description = e.detail.value;
    }
}
