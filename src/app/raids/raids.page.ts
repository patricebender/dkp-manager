import { Component, OnInit } from '@angular/core';
import {Settings} from '../Settings';
import {Observable} from 'rxjs';
import {Player} from '../models/Player';
import {Backend} from '../Backend';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {Raid} from '../models/Raid';
import {CreateUserComponent} from '../create-user/create-user.component';
import {ModalController} from '@ionic/angular';
import {CreateRaidComponent} from '../create-raid/create-raid.component';

@Component({
  selector: 'app-raids',
  templateUrl: './raids.page.html',
  styleUrls: ['./raids.page.scss'],
})
export class RaidsPage implements OnInit {
    private isModalPresent: any;
    get player(): Player {
        return Settings.Instance.player;
    }

  raids: Raid[];

    constructor(
        private modalController: ModalController,
        private oktaAuth: OktaAuthService,
        private http: HttpClient) {
    }

  ngOnInit() {
      console.log("RAIDS ENTERED")
  }


  async ionViewDidEnter() {
      await this.updateRaids();
  }

    private async updateRaids() {
        let raidObs = await this.getRaids();
        raidObs
            .subscribe(
                (res) => {
                    const raids = res.data;
                    this.raids = raids;
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

    async showCreateRaidModal() {
        if(this.isModalPresent) return;
        this.isModalPresent = true;
        const modal = await this.modalController.create({
            component: CreateRaidComponent,
            componentProps: {
            }
        });
        await modal.present();
        modal.onDidDismiss().then((callback) => {
            if(callback.data){
                console.log(callback.data.raid)
            }
            this.updateRaids();
            this.isModalPresent = false;
        });
    }

  private async getRaids(): Promise<Observable<any>> {
    const token = await this.oktaAuth.getAccessToken();
    return this.http.get<Raid>(Backend.address + '/raids', await Backend.getHttpOptions(token));
  }

}
