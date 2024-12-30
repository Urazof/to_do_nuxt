import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTodosStore } from '@/stores/useTodoStore';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/services/api';


// Mock API calls
vi.mock('@/services/api', () => ({
    getTodos: vi.fn(),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
}));

describe('Todos Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('should fetch todos', async () => {
        const mockTodos = [{ id: '1', title: 'Test Todo', isDone: false }];
        (getTodos as vi.Mock).mockResolvedValue(mockTodos);

        const store = useTodosStore();
        await store.getTodos();

        expect(store.todos).toEqual(mockTodos);
    });

    it('should add a todo', async () => {
        const newTodo = { id: '1', title: 'New Todo', isDone: false };
        (createTodo as vi.Mock).mockResolvedValue(newTodo);
        (getTodos as vi.Mock).mockResolvedValue([newTodo]);

        const store = useTodosStore();
        await store.addTodo('New Todo');

        expect(createTodo).toHaveBeenCalledWith(expect.objectContaining({
            title: 'New Todo',
            isDone: false,
        }));
        expect(store.todos).toEqual([newTodo]);
    });

    it('should remove a todo', async () => {
        (deleteTodo as vi.Mock).mockResolvedValue(undefined);
        (getTodos as vi.Mock).mockResolvedValue([]);

        const store = useTodosStore();
        await store.removeTodo('1');

        expect(deleteTodo).toHaveBeenCalledWith('1');
        expect(store.todos).toEqual([]);
    });

    it('should mark a todo as done', async () => {
        (updateTodo as vi.Mock).mockResolvedValue(undefined);
        const updatedTodo = { id: '1', title: 'Test Todo', isDone: true };
        (getTodos as vi.Mock).mockResolvedValue([updatedTodo]);

        const store = useTodosStore();
        await store.markAsDone('1');

        expect(updateTodo).toHaveBeenCalledWith('1', true);
        expect(store.todos).toEqual([updatedTodo]);
    });

    it('should mark a todo as undone', async () => {
        (updateTodo as vi.Mock).mockResolvedValue(undefined);
        const updatedTodo = { id: '1', title: 'Test Todo', isDone: false };
        (getTodos as vi.Mock).mockResolvedValue([updatedTodo]);

        const store = useTodosStore();
        await store.markAsUndone('1');

        expect(updateTodo).toHaveBeenCalledWith('1', false);
        expect(store.todos).toEqual([updatedTodo]);
    });
});

