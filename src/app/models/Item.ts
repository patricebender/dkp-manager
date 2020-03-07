import {PlayerClass} from './PlayerClass';
import {Spec} from './Spec';
import {Player} from './Player';

export class Item {
    name: string;
    ingameId: number;

    constructor(name: string, ingameId: number) {
        this.ingameId = ingameId;
        this.name = name;

    }


}
