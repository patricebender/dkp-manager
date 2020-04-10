import {PlayerClass} from './PlayerClass';
import {Spec} from './Spec';

export class Player {
    playerClass: PlayerClass;
    ingameName: string;
    spec: Spec;
    dkp: number;
    isAdmin: boolean;
    isRaidlead: boolean;
    mail: string;
    talent: string;
    prefersEnglish: boolean;
    dkpRank: number;
    _id: string;

    constructor(name: string, playerClass: PlayerClass, spec: Spec, talent: string) {
        this.ingameName = name;
        this.spec = spec;
        this.playerClass = playerClass;
        this.talent = talent;
    }


}
