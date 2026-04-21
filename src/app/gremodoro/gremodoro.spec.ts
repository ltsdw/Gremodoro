import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gremodoro } from './gremodoro';

describe('Gremodoro', () => {
    let component: Gremodoro;
    let fixture: ComponentFixture<Gremodoro>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Gremodoro],
        }).compileComponents();

        fixture = TestBed.createComponent(Gremodoro);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
