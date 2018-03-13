import { Pipe, PipeTransform } from '@angular/core'
import * as moment from 'moment';

@Pipe({
    name: 'released'
})

export class ReleasedPipe implements PipeTransform {

    transform(unix: number) {
        return moment.unix(unix).format("DD MMM, YYYY");
    }
}
