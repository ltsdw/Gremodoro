import { TestBed } from '@angular/core/testing';

import { Logger } from './logger';

describe('Logger', () => {
    let service: Logger;
    const fixedDate = new Date(2026, 3, 24, 14, 30, 45, 123);
    const fixedTime = '14:30:45.123';

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(Logger);

        vitest.useFakeTimers();
        vitest.setSystemTime(fixedDate);
    });

    afterAll(() => {
        vitest.useRealTimers();
        vitest.restoreAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call Logger.log with the right formatted string', () => {
        const spy = vitest.spyOn(console, 'log');
        const message = 'testing log';
        service.log(message);

        expect(spy).toHaveBeenCalledWith('[', fixedTime, '- LOG]', message, undefined);
    });

    it('should call Logger.warn with the right formatted string', () => {
        const spy = vitest.spyOn(console, 'warn');
        const message = 'testing warn';
        service.warn(message);

        expect(spy).toHaveBeenCalledWith('[', fixedTime, '- WARN]', message, undefined);
    });

    it('should call Logger.error with the right formatted string', () => {
        const spy = vitest.spyOn(console, 'error');
        const message = 'testing error';
        const mockError = { code: 404 };

        service.error(message, mockError);

        expect(spy).toHaveBeenCalledWith('[', fixedTime, '- ERROR]', message, mockError);
    });
});
