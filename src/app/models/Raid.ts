import {PlayerClass} from './PlayerClass';
import {Spec} from './Spec';
import {Player} from './Player';

export class Raid {
    dungeonName: string;
    date: Date;
    registrationDeadline: Date;
    registrations: Player[];
    description: string;


    constructor(dungeonName: string, date: Date, registrationDeadline: Date, description: string) {
        this.dungeonName = dungeonName;
        this.date = date;
        this.description = description;
        this.registrationDeadline = registrationDeadline;
    }


}
