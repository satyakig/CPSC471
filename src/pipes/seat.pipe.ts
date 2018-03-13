import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'seat'
})

export class SeatPipe implements PipeTransform {

    transform(num: any, format: string) {
        if(format == 'row')
            return String.fromCharCode(65 + num);
        else if(format == 'col')
            return num + 1;
        else
            return "Invalid format";        
    }
}
