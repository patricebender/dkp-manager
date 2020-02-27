import { Component, OnInit } from '@angular/core';
import {Settings} from '../Settings';
import {Observable} from 'rxjs';
import {Player} from '../models/Player';
import {Backend} from '../Backend';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {Raid} from '../models/Raid';

@Component({
  selector: 'app-raids',
  templateUrl: './raids.page.html',
  styleUrls: ['./raids.page.scss'],
})
export class RaidsPage implements OnInit {
    get player(): Player {
        return Settings.Instance.player;
    }

  raids: Raid[];

  constructor(private http: HttpClient, private oktaAuth: OktaAuthService) { }

  ngOnInit() {
      console.log("RAIDS ENTERED")
  }


  async ionViewDidEnter() {

    let raidObs = await this.getRaids();
    raidObs
        .subscribe(
            (res) => {
              const raids = res.data;
              this.raids = raids
            },
            (error) => {
              const statusCode = error.status;
              if (statusCode === 404) {
                console.log("nix gefunden")
              }
              if (statusCode === 500) {
                console.log('something went wrong ' + error);
              }

            }
        );
  }

  private async getRaids(): Promise<Observable<any>> {
    const token = await this.oktaAuth.getAccessToken();
    return this.http.get<Raid>(Backend.address + '/raids', await Backend.getHttpOptions(token));
  }

}
