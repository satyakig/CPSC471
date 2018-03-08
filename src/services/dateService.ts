import { Injectable } from '@angular/core'
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';

@Injectable()
export class DateService {

    constructor() { }
    
    getCurrentTime(format?: string) {
        if(format)
            return momentTz.tz("America/Edmonton").format(format);
        else
            return momentTz.tz("America/Edmonton").format("hh:mma - MMM DD, YYYY");
    }

    getCurrentUnixMilliSec() {
        return moment().valueOf();
    }

    getCurrentUnixSec() {
        return moment().unix();
    }
}