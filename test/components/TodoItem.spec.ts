import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TodoItem from '@/components/TodoItem.vue';

const vuetifyStubs = {
    VListItem: {
        template: '<div><slot /></div>',
    },
    VRow: {
        template: '<div><slot /></div>',
    },
    VCol: {
        template: '<div><slot /></div>',
    },
    VBtn: {
        template: '<div class="v-btn" @click="$emit(\'click\')"><slot /></div>',
    },
    VListItemAction: {
        template: '<div><slot /></div>',
    },
};

describe('TodoItem.vue', () => {
    it('should render todo title', () => {
        const todo = {
            id: '1',
            title: 'Test Todo',
            isDone: false,
        };

        const wrapper = mount(TodoItem, {
            props: { todo },
            global: {
                stubs: vuetifyStubs,
            },
        });

        const todoText = wrapper.find('.todo-text span');
        expect(todoText.text()).toBe('Test Todo');
    });

    it('should toggle todo status when the "Done" button is clicked', async () => {
        const todo = {
            id: '1',
            title: 'Test Todo',
            isDone: false,
        };

        const wrapper = mount(TodoItem, {
            props: { todo },
            global: {
                stubs: vuetifyStubs,
            },
        });

        console.log('DOM structure:', wrapper.html()); // Debug output

        const doneButton = wrapper.find('.done-button');
        await doneButton.trigger('click');

        expect(wrapper.emitted('toggleDone')).toBeTruthy();
        expect(wrapper.emitted('toggleDone')?.[0]).toEqual(['1']);
    });

    it('should call remove when "Remove" button is clicked', async () => {
        const todo = {
            id: '1',
            title: 'Test Todo',
            isDone: false,
        };

        const wrapper = mount(TodoItem, {
            props: { todo },
            global: {
                stubs: vuetifyStubs,
            },
        });

        console.log('DOM structure for remove:', wrapper.html()); // Debug output

        const removeButton = wrapper.find('.remove-button');
        await removeButton?.trigger('click');

        expect(wrapper.emitted('remove')).toBeTruthy();
        expect(wrapper.emitted('remove')?.[0]).toEqual(['1']);
    });

    it('should mark text as "done" if todo.isDone is true', () => {
        const todo = {
            id: '1',
            title: 'Test Todo',
            isDone: true,
        };

        const wrapper = mount(TodoItem, {
            props: { todo },
            global: {
                stubs: vuetifyStubs,
            },
        });

        const todoText = wrapper.find('.todo-text span');
        expect(todoText.classes()).toContain('done');
    });
});