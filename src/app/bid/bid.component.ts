import {Component, Input, OnInit} from '@angular/core';
import {Auction} from '../models/Auction';
import {Settings} from '../Settings';
import {Bid} from '../models/Bid';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.scss'],
})
export class BidComponent implements OnInit {


  constructor(  private modalController: ModalController) {
  }
  @Input()
  auction: Auction;

  dkpBid: number;

  ngOnInit() {

  }

  async ionViewDidEnter() {
    this.dkpBid = this.auction.minBid;
  }

  get myChar () {
    return Settings.Instance.player;
  }


  updateBid(e: CustomEvent) {
    console.log("Update dkpBid: " + e.detail.value)
    this.dkpBid = e.detail.value;
  }


  postBid() {
    this.modalController.dismiss({
      bid: new Bid(this.myChar, this.dkpBid),
      auctionId: this.auction._id
    });
  }
}
