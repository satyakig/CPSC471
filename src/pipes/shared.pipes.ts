import { NgModule } from '@angular/core';

import { RuntimePipe } from './runtime.pipe';
import { ReleasedPipe } from './released.pipe';
import { SanitizePipe } from './sanitize.pipe';
import { Time12Pipe } from './time12.pipe';
import { TimeUnixPipe } from './timeUnix.pipe';
import { SeatPipe } from './seat.pipe';
import { StatusPipe } from './status.pipe';
import { CardPipe } from './card.pipe';

@NgModule({
    declarations:[RuntimePipe, ReleasedPipe, SanitizePipe, Time12Pipe, TimeUnixPipe, SeatPipe, StatusPipe, CardPipe],
    exports: [RuntimePipe, ReleasedPipe, SanitizePipe, Time12Pipe, TimeUnixPipe, SeatPipe, StatusPipe, CardPipe]
})

export class SharedPipes {
    static forRoot() {
        return {
            ngModule: SharedPipes,
            providers: []
        }
    }
}