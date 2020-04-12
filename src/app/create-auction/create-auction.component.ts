import {Component, OnInit} from '@angular/core';
import {ItemRepo} from '../ItemRepo';
import {Item} from '../models/Item';
import {Settings} from '../Settings';
import {Raid} from '../models/Raid';
import {ModalController} from '@ionic/angular';
import {Auction} from '../models/Auction';

@Component({
    selector: 'app-create-auction',
    templateUrl: './create-auction.component.html',
    styleUrls: ['./create-auction.component.scss'],
})
export class CreateAuctionComponent implements OnInit {
    get auctionItem(): Item {
        return this._auctionItem;
    }

    set auctionItem(value: Item) {
        this._auctionItem = value;
    }

    filteredItems: Item[];
    searchTerm: string;
    minBid: number = 10;

    private _auctionItem: Item;

    get items(): Item[] {
        return ItemRepo.Instance.items;
    }

    get myChar() {
        return Settings.Instance.player;
    }

    constructor(  private modalController: ModalController) {
    }

    ngOnInit() {
    }




    setFilteredItems() {
        if (this.searchTerm.length === 0) {
            this.filteredItems = [];
        } else {
            this.filteredItems = this.items.filter((item) => {
                const filter = this.searchTerm.toLowerCase();
                return item.name.toLowerCase().startsWith(filter);
            });
        }
    }

    setAuctionItem(e: CustomEvent) {
        const item = this.items.filter((item) => {
            return item.name === e.detail.value;
        })[0];
        this._auctionItem = item;
    }

    setMinBid(e: CustomEvent) {
        this.minBid = e.detail.value;
    }

    createAuction() {
        this.modalController.dismiss({
            auction: new Auction(this.auctionItem, this.minBid, this.myChar)
        });
    }
}
