import {Item} from './Item';
import {Bid} from './Bid';
import {Player} from './Player';

export class Auction {
    item: Item;
    isClosed: boolean;
    _id: string;
    Bids: Bid[];
    winnerBid: Bid;

    constructor(item: Item){
        this.item = item;
    }



}

