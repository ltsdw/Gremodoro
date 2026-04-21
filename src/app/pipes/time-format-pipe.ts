import { Pipe, PipeTransform } from '@angular/core';
import { formatTime } from '../shared/utils/time.utils';

@Pipe({
    name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
    transform(value: number): string {
        return formatTime(value);
    }
}
