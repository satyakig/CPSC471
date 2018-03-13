import { Pipe, PipeTransform } from '@angular/core'
import * as moment from 'moment';

@Pipe({
    name: 'time12'
})

export class Time12Pipe implements PipeTransform {

    transform(value: any) {
        return moment(value, "Hmm").format("h:mma")
    }
}
