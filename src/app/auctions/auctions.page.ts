import { Component, OnInit } from '@angular/core';
import {Settings} from '../Settings';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {CreateRaidComponent} from '../create-raid/create-raid.component';
import {Raid} from '../models/Raid';
import {CreateAuctionComponent} from '../create-auction/create-auction.component';
import {Auction} from '../models/Auction';

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.page.html',
  styleUrls: ['./auctions.page.scss'],
})
export class AuctionsPage implements OnInit {
  private isModalPresent: boolean;

  get myChar () {
    return Settings.Instance.player;
  }

  constructor(
      private modalController: ModalController,
      private oktaAuth: OktaAuthService,
      private http: HttpClient,
      private toastController: ToastController,
      private alertController: AlertController) {
  }

  ngOnInit() {
  }

  async showCreateAuctionModal() {
    if (this.isModalPresent) {
      return;
    }
    this.isModalPresent = true;
    const modal = await this.modalController.create({
      component: CreateAuctionComponent,
      componentProps: {}
    });
    await modal.present();
    modal.onDidDismiss().then((callback) => {
      if (callback.data) {
        const auction: Auction = callback.data.auction;

      }
      this.isModalPresent = false;
    });
  }
}
