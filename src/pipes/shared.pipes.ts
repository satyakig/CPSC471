import { NgModule } from '@angular/core';

import { RuntimePipe } from './runtime.pipe';
import { ReleasedPipe } from './released.pipe';
import { SanitizePipe } from './sanitize.pipe';
import { Time12Pipe } from './time.pipe';

@NgModule({
    declarations:[RuntimePipe, ReleasedPipe, SanitizePipe, Time12Pipe],
    exports: [RuntimePipe, ReleasedPipe, SanitizePipe, Time12Pipe]
})

export class SharedPipes {
    static forRoot() {
        return {
            ngModule: SharedPipes,
            providers: []
        }
    }
}