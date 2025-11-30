import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Api from '@/services/api';
import type { Todo } from '@/types/todo';

describe('Api Class', () => {
    let mock: MockAdapter;
    const baseUrl = 'http://localhost:3000/';
    const api = Api.getInstance(baseUrl);
    const mockToken = 'mock-jwt-token';

    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    it('should create a todo successfully with auth token', async () => {
        const todo: Todo = { id: '1', title: 'Test Todo', isDone: false };
        mock.onPost(`${baseUrl}api/todos`).reply(200, todo);

        const response = await api.createTodo(todo, mockToken);
        expect(response).toEqual(todo);
    });

    it('should get todos successfully with auth token', async () => {
        const todos = [{ id: '1', title: 'Test Todo', isDone: false }];
        mock.onGet(`${baseUrl}api/todos`).reply(200, { todos });

        const response = await api.getTodos(mockToken);
        expect(response).toEqual(todos);
    });

    it('should update a todo successfully with auth token', async () => {
        const updatedTodo = { id: '1', isDone: true };
        mock.onPut(`${baseUrl}api/todos/1`).reply(200, updatedTodo);

        const response = await api.updateTodo('1', true, mockToken);
        expect(response).toEqual(updatedTodo);
    });

    it('should delete a todo successfully with auth token', async () => {
        mock.onDelete(`${baseUrl}api/todos/1`).reply(200, { success: true });

        const response = await api.deleteTodo('1', mockToken);
        expect(response).toEqual({ success: true });
    });

    it('should handle errors properly', async () => {
        mock.onPost(`${baseUrl}api/todos`).reply(500);

        await expect(api.createTodo({ id: '1', title: 'Test Todo', isDone: false }, mockToken))
            .rejects
            .toThrow('Error creating todo: Request failed with status code 500');
    });
});
