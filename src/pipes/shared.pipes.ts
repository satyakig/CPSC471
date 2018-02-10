
import { NgModule } from '@angular/core';

import { RuntimePipe } from './runtime.pipe';
import { ReleasedPipe } from './released.pipe';

@NgModule({
    declarations:[RuntimePipe, ReleasedPipe],
    exports: [RuntimePipe, ReleasedPipe]
})

export class SharedPipes {
    static forRoot() {
        return {
            ngModule: SharedPipes,
            providers: []
        }
    }
}