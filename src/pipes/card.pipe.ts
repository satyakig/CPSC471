import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'card'
})

export class CardPipe implements PipeTransform {

    transform(value: any) {
        return ("**" + value.splice(12));
    }
}
