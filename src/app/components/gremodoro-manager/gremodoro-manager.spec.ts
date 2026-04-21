import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GremodoroManager } from './gremodoro-manager';

describe('GremodoroManager', () => {
    let component: GremodoroManager;
    let fixture: ComponentFixture<GremodoroManager>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GremodoroManager],
        }).compileComponents();

        fixture = TestBed.createComponent(GremodoroManager);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
