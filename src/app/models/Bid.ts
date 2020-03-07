import {Player} from './Player';
import {Auction} from './Auction';

export class Bid {

    player: Player;
    dkpBid: number;
    constructor(player: Player, dkp: number){
        this.player = player;
        this.dkpBid = dkp;

    }


}

