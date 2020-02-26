import {HttpHeaders, HttpParams} from '@angular/common/http';
import {OktaAuthService} from '@okta/okta-angular';

export class Backend {

    static get address(): string {
        return this._address;
    }

    static set address(value: string) {
        this._address = value;
    }

    private static PORT = '3000';
    private static _address = 'http://localhost:' + Backend.PORT;


    static async getHttpOptions(token: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        };
        return httpOptions;
    }


}
