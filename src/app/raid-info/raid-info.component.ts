import {Component, Input, OnInit} from '@angular/core';
import {Raid} from '../models/Raid';
import {Settings} from '../Settings';
import {Player} from '../models/Player';
import {PlayerClass} from '../models/PlayerClass';
import {Spec} from '../models/Spec';


@Component({
    selector: 'app-raid-info',
    templateUrl: './raid-info.component.html',
    styleUrls: ['./raid-info.component.scss'],
})
export class RaidInfoComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    @Input() raid: Raid;
    get PlayerClass() {
        return PlayerClass;
    }

    isAlreadyRegistered(): boolean {
        return this.raid.confirm.some(reg => reg.player.mail === this.myChar.mail)
            || this.raid.bench.some(reg => reg.player.mail === this.myChar.mail)
            || this.raid.late.some(reg => reg.player.mail === this.myChar.mail)
            || this.raid.decline.some(reg => reg.player.mail === this.myChar.mail);
    }

    get confirmedHeals(){
        return this.raid.confirm.filter((reg) => {
            return reg.player.spec === Spec.Heal;
        });
    }
    get confirmedDDs(){
        return this.raid.confirm.filter((reg) => {
            return reg.player.spec === Spec.DD;
        });
    }
    get confirmedTanks(){
        return this.raid.confirm.filter((reg) => {
            return reg.player.spec === Spec.Tank;
        });
    }

    findConfirmedPlayersOfOneClass(playerClass: PlayerClass): Player[] {
        const players = this.raid.confirm;
        return players.filter((registration) => {
            return registration.player.playerClass === playerClass;
        }).map(registration => registration.player);
    }

    get myChar() {
        return Settings.Instance.player;
    }


}
