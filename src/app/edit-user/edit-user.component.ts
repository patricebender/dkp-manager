import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../models/Player';
import {Backend} from '../Backend';
import {ToastController} from '@ionic/angular';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {Settings} from '../Settings';
import {DkpLogType} from '../models/DkpLogType';
import {DkpEntry} from '../models/DkpEntry';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {

    constructor(private oktaAuth: OktaAuthService,
                private http: HttpClient
        , private toastController: ToastController,
    ) {
    }

    @Input() player: Player;



    get myChar() {
      return Settings.Instance.player;
    }


    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }


    ngOnInit() {
        console.log(this.player);
    }

    async createAndPostDkpEntry(dkp: number, reason: string){
        const dkpLogType = dkp > 0 ? DkpLogType.Bonus : DkpLogType.Penalty;
        const dkpEntry = new DkpEntry(dkpLogType, reason, this.myChar.ingameName, new Date(), dkp);
        this.postDkpEntry(dkpEntry);
    }

     get token() {
        return this.oktaAuth.getAccessToken();
    }

    async postDkpEntry(dkpEntry: DkpEntry) {
        const token = await this.token;
        const options = await Backend.getHttpOptions(token);

        this.http.patch(Backend.address + '/player/dkp' + this.player.mail, dkpEntry, options)
            .subscribe((data) => {
                console.log('user update successful!', data);
                this.presentToast( "DKP Update Erfolgreich!");
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });
    }

        async promoteToAdmin() {
        const token = await this.token
        const options = await Backend.getHttpOptions(token);
        this.player.isAdmin = true;

        this.http.patch(Backend.address + '/player', this.player, options)
            .subscribe((data) => {
                console.log('user update successful!', data);
                this.presentToast('Yeah ' + this.player.ingameName + 'ist jetzt ein admin');
            }, (e) => {
                console.log(e);
                this.presentToast('Da ist wohl was schiefgegangen 🤮');
            });
    }

  async demoteAdmin() {
    const token = await this.oktaAuth.getAccessToken();
    const options = await Backend.getHttpOptions(token);
    this.player.isAdmin = false;

    this.http.patch(Backend.address + '/player', this.player, options)
        .subscribe((data) => {
          console.log('user update successful!', data);
          this.presentToast('Yeah ' + this.player.ingameName + 'ist jetzt Kein Admin mehr');
        }, (e) => {
          console.log(e);
          this.presentToast('Da ist wohl was schiefgegangen 🤮');
        });
  }
}
