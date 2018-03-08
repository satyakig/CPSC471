import { NgModule } from '@angular/core';

import { RuntimePipe } from './runtime.pipe';
import { ReleasedPipe } from './released.pipe';
import { SanitizePipe } from './sanitize.pipe';
import { Time12Pipe } from './time12.pipe';
import { TimeUnixPipe } from './timeUnix.pipe';
import { SeatPipe } from './seat.pipe';

@NgModule({
    declarations:[RuntimePipe, ReleasedPipe, SanitizePipe, Time12Pipe, TimeUnixPipe, SeatPipe],
    exports: [RuntimePipe, ReleasedPipe, SanitizePipe, Time12Pipe, TimeUnixPipe, SeatPipe]
})

export class SharedPipes {
    static forRoot() {
        return {
            ngModule: SharedPipes,
            providers: []
        }
    }
}