import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
    name: 'status'
})

export class StatusPipe implements PipeTransform {

    transform(value: number) {
        if(value == 0)
            return "Please notify us when you want us to start preparing the order.";
        else if(value == 1)
            return "Order is being prepared.";
        else if(value == 2)
            return "Order is ready to be picked up."
        else
            return "Unknown Status"
    }
}
