import { Injectable } from '@angular/core'
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';

@Injectable()
export class DateService {
    private selectedDate = this.getCurrentTime('dddd, MMM DD');

    constructor() { }   

    getCurrentTime(format?: string) {
        if(format)
            return momentTz.tz("America/Edmonton").format(format);
        else
            return momentTz.tz("America/Edmonton").format("hh:mma - MMM DD, YYYY");
    }

    getUnixMilliSec() {
        return moment().valueOf();
    }

    getUnixSec() {
        return moment().unix();
    }

    getSelectedDate() {
        return this.selectedDate;
    }

    getSelectedUnixDate() {
        return moment(this.selectedDate, 'dddd, MMM DD').unix();
    }

    setSelectedDate(date: string) {
        this.selectedDate = date;
    }
}