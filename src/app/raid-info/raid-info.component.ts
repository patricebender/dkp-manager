import {Component, Input, OnInit} from '@angular/core';
import {Raid} from '../models/Raid';
import {Settings} from '../Settings';
import {Player} from '../models/Player';
import {PlayerClass} from '../models/PlayerClass';


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
