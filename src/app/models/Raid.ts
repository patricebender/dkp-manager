import {PlayerClass} from './PlayerClass';
import {Spec} from './Spec';
import {Player} from './Player';

export class Raid {
    dungeonName: string;
    date: Date;
    registrationDeadline: Date;
    registrations: Player[];


    constructor(dungeonName: string, date: Date) {
        this.dungeonName = dungeonName;
        this.date = date;
    }


}
