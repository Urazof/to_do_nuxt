import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TodoList from '@/components/TodoList.vue';
import TodoItem from '@/components/TodoItem.vue';

// Stub Vuetify components
const stubs = {
    'v-list': { template: '<div><slot /></div>' },
    'v-list-item': { template: '<div><slot /></div>' },
    'v-row': { template: '<div><slot /></div>' },
    'v-col': { template: '<div><slot /></div>' },
    'v-btn': { template: '<button><slot /></button>' },
    'v-list-item-action': { template: '<div><slot /></div>' },
};

vi.mock('@/stores/useTodoStore', () => ({
    useTodosStore: () => ({
        todos: [
            { id: '1', title: 'Todo 1', isDone: false },
            { id: '2', title: 'Todo 2', isDone: true },
        ],
    }),
}));

describe('TodoList.vue', () => {
    it('renders a list of todos', () => {
        const wrapper = mount(TodoList, {
            global: {
                stubs,
            },
        });

        const todoItems = wrapper.findAllComponents(TodoItem);
        expect(todoItems).toHaveLength(2); // Matches the mocked todos length
    });

    it('emits toggle-done event when a todo is toggled', async () => {
        const wrapper = mount(TodoList, {
            global: {
                stubs,
            },
        });

        // Simulate the toggle-done event from TodoItem
        const todoItem = wrapper.findComponent(TodoItem);
        await todoItem.vm.$emit('toggle-done', '1');

        expect(wrapper.emitted('toggle-done')).toBeTruthy();
        expect(wrapper.emitted('toggle-done')?.[0]).toEqual(['1']);
    });

    it('emits remove event when a todo is removed', async () => {
        const wrapper = mount(TodoList, {
            global: {
                stubs,
            },
        });

        // Simulate the remove event from TodoItem
        const todoItem = wrapper.findComponent(TodoItem);
        await todoItem.vm.$emit('remove', '1');

        expect(wrapper.emitted('remove')).toBeTruthy();
        expect(wrapper.emitted('remove')?.[0]).toEqual(['1']);
    });
});
