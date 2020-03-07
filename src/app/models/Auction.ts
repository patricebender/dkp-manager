import {Item} from './Item';
import {Bid} from './Bid';
import {Player} from './Player';

export class Auction {
    item: Item;
    isClosed: boolean;
    _id: string;
    minBid: number;
    bids: Bid[];
    winnerBid: Bid;

    constructor(item: Item, minBid: number){
        this.item = item;
        this.minBid = minBid;
    }



}

