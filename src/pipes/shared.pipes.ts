import { NgModule } from '@angular/core';

import { RuntimePipe } from './runtime.pipe';
import { ReleasedPipe } from './released.pipe';
import { SanitizePipe } from './sanitize.pipe';

@NgModule({
    declarations:[RuntimePipe, ReleasedPipe, SanitizePipe],
    exports: [RuntimePipe, ReleasedPipe, SanitizePipe]
})

export class SharedPipes {
    static forRoot() {
        return {
            ngModule: SharedPipes,
            providers: []
        }
    }
}