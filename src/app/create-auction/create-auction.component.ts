import {Component, Input, OnInit} from '@angular/core';
import {ItemRepo} from '../ItemRepo';
import {Item} from '../models/Item';
import {Settings} from '../Settings';
import {Raid} from '../models/Raid';
import {ModalController} from '@ionic/angular';
import {Auction} from '../models/Auction';
import {consoleTestResultHandler} from "tslint/lib/test";

@Component({
    selector: 'app-create-auction',
    templateUrl: './create-auction.component.html',
    styleUrls: ['./create-auction.component.scss'],
})
export class CreateAuctionComponent implements OnInit {
    get auctionItems(): Item[] {
        return this._auctionItems;
    }

    set auctionItems(value: Item[]) {
        this._auctionItems = value;
    }


    filteredItems: Item[] = [];
    // predefined ids from boss loot table as filter
    @Input()
    lootIds: number[];


    searchTerm: string = '';
    minBid: number = 10;

    private _auctionItems: Item[] = [];


    get items(): Item[] {
        return ItemRepo.Instance.items;
    }

    get myChar() {
        return Settings.Instance.player;
    }

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        console.log("entered auctions with: " + this.lootIds)
        this.setFilteredItems();
    }


    setFilteredItems() {

        let filteredLoot: Item[];

        if (this.lootIds && this.searchTerm.length >= 0) {
            filteredLoot = this.items.filter((item) => {
                const filter = this.searchTerm.toLowerCase();
                return item.name.toLowerCase().startsWith(filter) && this.lootIds.includes(item.ingameId);
            });
        } else if (this.searchTerm.length === 0) {
            filteredLoot = [];
        } else {
            filteredLoot = this.items.filter((item) => {
                const filter = this.searchTerm.toLowerCase();
                return item.name.toLowerCase().startsWith(filter);
            });
        }

        this.filteredItems = [];
        const map = new Map();
        for (const item of filteredLoot) {
            if (!map.has(item.ingameId)) {
                map.set(item.ingameId, true);
                this.filteredItems.push(item);
            }
        }
    }

    setMinBid(e: CustomEvent) {
        this.minBid = e.detail.value;
    }

    createAuctions() {
        console.log(this.auctionItems);
        this.modalController.dismiss({
            auctions: this.auctionItems.map(auctionItem => new Auction(auctionItem, this.minBid, this.myChar))
        });


    }

    itemChecked(e: CustomEvent) {
        const item = e.detail.value;
        if (!item.checked) {
            // remove unchecked item from auction list
            this.auctionItems = this.auctionItems.filter(listItem => listItem.ingameId !== item.ingameId);
        } else {
            this.auctionItems.push(item);
        }
    }
}
