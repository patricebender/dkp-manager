import {Component, OnInit} from '@angular/core';
import {Settings} from '../Settings';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {CreateRaidComponent} from '../create-raid/create-raid.component';
import {Raid} from '../models/Raid';
import {CreateAuctionComponent} from '../create-auction/create-auction.component';
import {Auction} from '../models/Auction';
import {Backend} from '../Backend';
import {Observable} from 'rxjs';
import {BidComponent} from '../bid/bid.component';
import {Bid} from '../models/Bid';
import {CloseAuctionComponent} from '../close-auction/close-auction.component';

@Component({
    selector: 'app-auctions',
    templateUrl: './auctions.page.html',
    styleUrls: ['./auctions.page.scss'],
})
export class AuctionsPage implements OnInit {
    private isModalPresent: boolean;
    private auctions: Auction[] = [];


    get myChar() {
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

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

    private async postAuction(auction: Auction) {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);

        this.http.post(Backend.address + '/auction', auction, options)
            .subscribe((data) => {
                this.updateAuctions();
                console.log('auction creation successful!', data);
                this.presentToast('Yeah die Auktion wurde erstellt!');
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });

    }


    async ionViewDidEnter() {
        await this.updateAuctions();
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
                this.postAuction(auction);
            }
            this.isModalPresent = false;
        });
    }


    private async updateAuctions() {
        let raidObs = await this.getAuctions();
        raidObs
            .subscribe(
                (res) => {
                    const auctions = res.data;
                    this.auctions = auctions;
                    console.log('Fetched: ' + this.auctions);
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

    private async getAuctions(): Promise<Observable<any>> {
        const token = await this.oktaAuth.getAccessToken();
        return this.http.get<Auction>(Backend.address + '/auctions', await Backend.getHttpOptions(token));
    }

    async presentCloseAuction(auction: Auction) {
        if (this.isModalPresent) {
            return;
        }
        this.isModalPresent = true;
        const modal = await this.modalController.create({
            component: CloseAuctionComponent,
            componentProps: {
                auctionId: auction._id
            }
        });
        await modal.present();
        modal.onDidDismiss().then(() => {

            console.log('ended auction');
            this.updateAuctions();
            this.isModalPresent = false;
        });
    }



    async showBidModal(auction: Auction) {
        if (this.isModalPresent) {
            return;
        }
        this.isModalPresent = true;
        const modal = await this.modalController.create({
            component: BidComponent,
            componentProps: {
                auction: auction
            }
        });
        await modal.present();
        modal.onDidDismiss().then((callback) => {
            if (callback.data) {
                const bid: Bid = callback.data.bid;
                const auctionId: any = callback.data.auctionId;
                console.log(bid);
                this.postBid(auctionId, bid);
            }
            this.isModalPresent = false;
        });
    }

    private async postBid(auctionId: any, bid: Bid) {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);

        this.http.patch(Backend.address + '/auction/bid/' + auctionId, bid, options)
            .subscribe((data) => {
                this.updateAuctions();
                console.log('bid creation successful!', data);
                this.presentToast('Yeah dein Gebot wurde erstellt!');
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });

    }

    async presentDeleteConfirm(auction: Auction) {
        const alert = await this.alertController.create({
            header: 'Auktion Löschen?',
            message: 'Bist du dir Sicher, dass du die Auktion aus der Liste löschen möchtest?',
            buttons: [
                {
                    text: 'Löschen',
                    handler: () => {
                        this.deleteAuction(auction);
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

    async deleteAuction(auction: Auction) {
        const token = await this.oktaAuth.getAccessToken();
        const options = await Backend.getHttpOptions(token);


        this.http.delete(Backend.address + '/auction/' + auction._id, options)
            .subscribe((data) => {
                console.log('auction deleted!', data);
                this.updateAuctions();
                this.presentToast('Auktion aus Liste gelöscht!');
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });
    }


}
