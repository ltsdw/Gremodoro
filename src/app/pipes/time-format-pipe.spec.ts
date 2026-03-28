import { TimeFormatPipe } from './time-format-pipe';

describe('TimeFormatPipe', () => {
    it('create an instance', () => {
        const pipe = new TimeFormatPipe();
        expect(pipe).toBeTruthy();
    });

    it('the time should be formatted to MM:SS format', () => {
        const pipe = new TimeFormatPipe();
        expect(pipe.transform(1500)).toBe('25:00');
    });
});
