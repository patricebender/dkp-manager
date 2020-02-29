import {PlayerClass} from './PlayerClass';
import {Spec} from './Spec';
import {DkpLogType} from './DkpLogType';
import {Player} from './Player';

export class DkpEntry {
    dkpLogType: DkpLogType;
    reason: string;
    dkp: number;
    date: Date;
    author: string;
    player: string;


    constructor(dkpLogType: DkpLogType, reason: string, author: string, date: Date, dkp: number, player: string) {
        this.dkpLogType = dkpLogType;
        this.author = author;
        this.date = date;
        this.dkp = dkp;
        this.reason = reason;
        this.player = player;
    }


}
