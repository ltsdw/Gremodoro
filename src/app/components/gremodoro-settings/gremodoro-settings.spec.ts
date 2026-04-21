import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { DialogRef } from '@angular/cdk/dialog';

import { GremodoroSettings } from './gremodoro-settings';
import { Logger } from '../../services/logger';
import { GremodoroSettings as GremodoroSettingsService } from '../../services/gremodoro-settings';

describe('GremodoroSettings Component', () => {
    let component: GremodoroSettings;
    let fixture: ComponentFixture<GremodoroSettings>;
    let mockLogger: any;
    let mockDialogRef: any;
    let mockSettingsService: any;

    const mockInitialSettings = {
        focusTime: 25,
        shortBreak: 5,
        longBreak: 15,
    };

    beforeEach(async () => {
        mockLogger = { log: vitest.fn() };
        mockDialogRef = { close: vitest.fn() };

        mockSettingsService = {
            settings: vitest.fn().mockReturnValue(mockInitialSettings),
            saveSettings: vitest.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [GremodoroSettings],
            providers: [
                { provide: Logger, useValue: mockLogger },
                { provide: DialogRef, useValue: mockDialogRef },
                { provide: GremodoroSettingsService, useValue: mockSettingsService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GremodoroSettings);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with the settings', () => {
        const rawFormValues = component.settingsForm.getRawValue();

        expect(rawFormValues).toEqual(mockInitialSettings);
    });

    it('should mark the form as invalid for values below 1', () => {
        component.settingsForm.patchValue({ focusTime: 0, shortBreak: 0, longBreak: 0 });

        expect(component.settingsForm.invalid).toBeTruthy();
    });

    it('should mark the forms as invalid for values above 120', () => {
        component.settingsForm.patchValue({ focusTime: 121 });

        expect(component.settingsForm.invalid).toBeTruthy();
    });

    it('should mark the form as valid for values between (1 - 120)', () => {
        component.settingsForm.patchValue({ focusTime: 60, shortBreak: 10, longBreak: 30 });

        expect(component.settingsForm.valid).toBeTruthy();
    });

    it('should not save when the form is invalid', () => {
        component.settingsForm.patchValue({ focusTime: 0 });

        component.save();

        expect(mockSettingsService.saveSettings).not.toHaveBeenCalled();
        expect(mockLogger.log).not.toHaveBeenCalled();
        expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should call the services, save and close the modal for valid form', () => {
        const newSettings = { focusTime: 50, shortBreak: 10, longBreak: 20 };
        component.settingsForm.patchValue(newSettings);

        component.save();

        expect(mockSettingsService.saveSettings).toHaveBeenCalledWith(newSettings);
        expect(mockLogger.log).toHaveBeenCalledWith('New settings saved!');
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should close the modal', () => {
        component.close();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
});
