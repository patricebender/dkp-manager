import {PlayerClass} from './PlayerClass';
import {Spec} from './Spec';
import {Player} from './Player';

export class Raid {
    dungeonName: string;
    date: Date;
    registrationDeadline: Date;
    description: string;

    bench: Player[];
    attend: Player[];
    declined: Player[];
    late: Player[] ;

    get registrationCount(){
        return this.attend.length + this.bench.length + this.declined.length + this.late.length
    }
    constructor(dungeonName: string, date: Date, registrationDeadline: Date, description: string) {
        this.dungeonName = dungeonName;
        this.date = date;
        this.description = description;
        this.registrationDeadline = registrationDeadline;
    }


}
