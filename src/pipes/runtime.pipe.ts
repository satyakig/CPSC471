import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'runtime'
})

export class RuntimePipe implements PipeTransform {

    transform(time: number) {
        var hr = Math.floor(time / 60);
        let min = time % 60;

        if(hr == 0)
            return (min + " min");
        else if(min == 0)
            return (hr + " hr");
        else
            return (hr + " hr " + min + " min");
    }   
}
