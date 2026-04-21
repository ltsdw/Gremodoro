import { TestBed } from '@angular/core/testing';

import { TodoList } from './todo-list';

describe('TodoList', () => {
    let service: TodoList;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TodoList);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
