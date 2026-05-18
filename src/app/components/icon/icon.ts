import { Component, input } from '@angular/core';

@Component({
    selector: 'app-icon',
    imports: [],
    templateUrl: './icon.html',
    host: { '[style.font-size]': 'size()' },
    styleUrl: './icon.scss',
})
export class Icon {
    name = input.required<
        | 'close'
        | 'play-pause'
        | 'settings'
        | 'play'
        | 'pause-circle'
        | 'backward'
        | 'x-mark'
        | 'list'
        | 'plus'
        | 'circle'
        | 'check-circle'
        | 'trash'
        | 'chevron-down'
        | 'bars'
    >();

    size = input<number | string | undefined>();
}
