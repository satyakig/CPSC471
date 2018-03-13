import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';

@Injectable()
export class DateService {
    currentTime = new Subject();
    time24 = new Subject();

    constructor() {
        setInterval(() => {
            this.currentTime.next(this.getCurrentUnixSec())
        }, 1000);

        setInterval(() => {
            this.time24.next(this.getCurrent24Time())
        }, 1000);
    }
    
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

    getCurrent24Time() {
        return moment().format("Hmm");
    }

    getToday() {
        let today = moment().format('dddd, MMM DD');
        return moment(today, 'dddd, MMM DD').unix();
    }

    getNextDay() {
        let tomo = moment().add(1, "day");
        return moment(tomo.format('dddd, MMM DD'), 'dddd, MMM DD').unix();
    }

    getCurrentTimeSub() {
        return this.currentTime;
    }  

    get24HrTimeSub() {
        return this.time24;
    }
}