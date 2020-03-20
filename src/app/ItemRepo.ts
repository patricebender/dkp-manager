import {Item} from './models/Item';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';

import items from '../assets/items.json';


export class ItemRepo {
    set items(value: Item[]) {
        this._items = value;
    }


    private static _instance: ItemRepo;


    private _items: Item[] = [];

    get items() {
        if (this._items.length === 0) {
            this.readAndSaveItemsFromCSV();
        }
        return this._items;
    }

    private constructor() {
    }


    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    private readAndSaveItemsFromCSV() {
        for (let item of items) {
            if (!this._items.includes(item)) {
                this._items.push(item);
            }
        }
    }
}
