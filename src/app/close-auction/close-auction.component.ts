import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Auction} from '../models/Auction';
import {Backend} from '../Backend';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {Settings} from '../Settings';
import {Bid} from '../models/Bid';
import {DkpLogType} from '../models/DkpLogType';
import {DkpEntry} from '../models/DkpEntry';
import {Player} from '../models/Player';
import {Item} from '../models/Item';

@Component({
    selector: 'app-close-auction',
    templateUrl: './close-auction.component.html',
    styleUrls: ['./close-auction.component.scss'],
})
export class CloseAuctionComponent implements OnInit {
    get auction(): Auction {
        return this._auction;
    }

    set auction(value: Auction) {
        this._auction = value;
    }


    constructor(
        private modalController: ModalController,
        private oktaAuth: OktaAuthService,
        private http: HttpClient,
        private toastController: ToastController,
        private alertController: AlertController) {
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

    @Input()
    auctionId: number;
    private _auction: Auction;


    async ionViewDidEnter() {
        await this.updateAuction();
    }


    get myChar() {
        return Settings.Instance.player;
    }


    private async updateAuction() {
        let auctionObs = await this.getAuction();
        auctionObs
            .subscribe(
                (res) => {
                    console.log(' daksndfasnosfnasoifnasognfasöfnasigbasi' + res);
                    const auction = res.item;
                    this._auction = auction;
                },
                (error) => {
                    const statusCode = error.status;
                    if (statusCode === 404) {
                        console.log('nix gefunden');
                    }
                    if (statusCode === 500) {
                        console.log('something went wrong ' + error);
                    }

                }
            );
    }

    private async getAuction(): Promise<Observable<any>> {
        const token = await this.oktaAuth.getAccessToken();
        return this.http.get<Auction>(Backend.address + '/auction/' + this.auctionId, await Backend.getHttpOptions(token));
    }

    ngOnInit() {
    }

    async presentConfirmEndAuction(bid: Bid) {
        const alert = await this.alertController.create({
            header: 'Auktion Beenden?',
            message: 'Bist du dir Sicher, dass du die Auktion beenden möchtest?',
            buttons: [
                {
                    text: 'Auktion Beenden',
                    handler: () => {
                        this.closeAuction(bid);
                    }
                },
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: this.myChar.playerClass.toString().toLowerCase(),
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }
            ]
        });

        await alert.present();
    }


    private async closeAuction(bid: Bid) {
      const auction = this.auction;

      const options = await Backend.getHttpOptions(await this.oktaAuth.getAccessToken());

      auction.isClosed = true;
      auction.winnerBid = bid ;
      this.http.patch(Backend.address + '/auction/close/' + auction._id, auction, options)
          .subscribe((data) => {
            console.log('close auction success', data);
            this.createAndPostDkpEntry(auction)
            this.presentToast("Auktion erfolgreich beendet!")
          }, (e) => {
            console.log(e);
            this.presentToast('Da ist wohl was schiefgegangen 🤮');
          });
      await this.modalController.dismiss();
    }

  async createAndPostDkpEntry(auction: Auction) {

    const dkpEntry = new DkpEntry(DkpLogType.WonAuction, auction.item.name, this.myChar.ingameName, new Date(), -auction.winnerBid.dkpBid, auction.winnerBid.player.mail);
    dkpEntry.item = auction.item;
    this.postDkpEntry(dkpEntry, auction.winnerBid.player);
  }

  async postDkpEntry(dkpEntry: DkpEntry, player: Player) {
    const token = await this.oktaAuth.getAccessToken();
    const options = await Backend.getHttpOptions(token);

    this.http.patch(Backend.address + '/dkp/' + player.mail, dkpEntry, options)
        .subscribe((data) => {
          console.log('dkp patch successful!', data);
          this.presentToast('DKP erfolgreich verbucht!');
        }, (e) => {
          console.log(e);
          this.presentToast('Da ist wohl was schiefgegangen 🤮');
        });
  }
}
