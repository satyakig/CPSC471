import { NgModule } from '@angular/core';

import { RuntimePipe } from './runtime.pipe';
import { ReleasedPipe } from './released.pipe';
import { SanitizePipe } from './sanitize.pipe';
import { Time12Pipe } from './time12.pipe';
import { TimePipe } from './time.pipe';

@NgModule({
    declarations:[RuntimePipe, ReleasedPipe, SanitizePipe, Time12Pipe, TimePipe],
    exports: [RuntimePipe, ReleasedPipe, SanitizePipe, Time12Pipe, TimePipe]
})

export class SharedPipes {
    static forRoot() {
        return {
            ngModule: SharedPipes,
            providers: []
        }
    }
}