import {PlayerClass} from './PlayerClass';
import {Spec} from './Spec';
import {Player} from './Player';

export class Raid {
    dungeonName: string;
    date: Date;
    registrationDeadline: Date;
    description: string;

    bench: any[];
    confirm: any[];
    decline: any[];
    late: any[] ;
    isClosed: boolean;
    _id: string;
    raidLead: Player;
    raidCreator: Player;
    invite: number;

    constructor(dungeonName: string, date: Date, registrationDeadline: Date, description: string, raidCreator: Player, raidLead: Player, invite: number) {
        this.dungeonName = dungeonName;
        this.date = date;
        this.description = description;
        this.registrationDeadline = registrationDeadline;
        this.raidCreator = raidCreator;
        this.raidLead = raidLead;
        this.invite = invite;
    }


}

class Registration {
    player: Player[];
    date: Date;
}
