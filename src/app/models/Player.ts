import {PlayerClass} from './PlayerClass';
import {Spec} from './Spec';

export class Player {
    playerClass: PlayerClass;
    ingameName: string;
    spec: Spec;
    dkp: number;
    isAdmin: boolean;

    constructor(name: string, playerClass: PlayerClass, spec: Spec) {
        this.ingameName = name;
        this.spec = spec;
        this.playerClass = playerClass;
    }


}
