import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../models/Player';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {ModalController, ToastController} from '@ionic/angular';
import {Raid} from '../models/Raid';
import {Settings} from '../Settings';
import {GuildRepo} from '../GuildRepo';

@Component({
    selector: 'app-create-raid',
    templateUrl: './create-raid.component.html',
    styleUrls: ['./create-raid.component.scss'],
})
export class CreateRaidComponent  {
    dungeonName: string;
    date: Date = new Date();
    registrationDeadline: Date;
    description: string;
    playerLimit: number = 40;
    raidLead: Player = this.myChar;

    players: Player[] = [];

    get raidLeads() {
        return this.players
            .filter(p => p.isAdmin || p.isRaidlead);
    }

    @Input()
    existingRaid: Raid;

    get dungeonNames(): string[] {
        return this._dungeonNames;
    }

    get myChar(): Player {
        return Settings.Instance.player;
    }


    constructor(private oktaAuth: OktaAuthService,
                private http: HttpClient,
                private toastController: ToastController,
                private modalController: ModalController,
                private guildRepo: GuildRepo) {
    }

    dismiss() {
        const raid = new Raid(this.dungeonName, this.date, this.date, this.description, this.myChar, this.raidLead);
        if (this.existingRaid) {
            raid._id = this.existingRaid._id;
        }
        this.modalController.dismiss({
            raid,
            isUpdate: !!this.existingRaid
        });
    }


    private _dungeonNames: string[] = [
        'Molten Core',
        'Blackwing Lair',
        'Zul Gurub',
        'Onyxia',
        'MC und BWL'
    ];


    async ionViewWillEnter() {
        this.players = await this.guildRepo.getPlayers();
        if (this.existingRaid) {
            this.raidLead = this.existingRaid.raidLead;
            this.dungeonName = this.existingRaid.dungeonName;
            this.date = this.existingRaid.date;
            this.registrationDeadline = this.existingRaid.registrationDeadline;
            this.description = this.existingRaid.description;
            this.raidLead = this.existingRaid.raidLead || this.myChar;
            console.log(this.existingRaid);
        }

    }


    get now() {
        const now = new Date();
        return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDay();
    }

    isValidRaid() {
        return this.description && this.dungeonName && this.date && this.raidLead;
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

    setDescription(e: CustomEvent) {
        this.description = e.detail.value;
    }

    setRaidLead(e) {
        const player: Player = e.detail.value;
        console.log(player);
        this.raidLead = player;

    }
}
