import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
    transform(value: number): string {
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');

        return `${minutesStr}:${secondsStr}`;
    }
}
