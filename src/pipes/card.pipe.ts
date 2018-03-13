import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'card'
})

export class CardPipe implements PipeTransform {

    transform(value: string) {
        return ("**" + value.slice(12));
    }
}
