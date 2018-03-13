import { Pipe, PipeTransform } from '@angular/core'
import * as moment from 'moment';

@Pipe({
    name: 'timeUnix'
})

export class TimeUnixPipe implements PipeTransform {

    transform(value: number, format?: string, ) {
        if(format) {
            return moment.unix(value).format(format);
        }
        else
            return moment.unix(value).format("MMM DD 'YY");
    }
}
