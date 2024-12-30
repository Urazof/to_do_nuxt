import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Input from '@/components/Input.vue';

const vuetifyStubs = {
    VTextField: {
        template: '<input :placeholder="$attrs.placeholder" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    },
    VBtn: {
        template: '<button @click="$emit(\'click\')"><slot /></button>',
    },
};

describe('Input.vue', () => {
    it('renders the input field and button', () => {
        const wrapper = mount(Input, {
            global: {
                stubs: vuetifyStubs,
            },
        });

        expect(wrapper.find('input').exists()).toBe(true);
        expect(wrapper.find('button').exists()).toBe(true);
    });

    it('emits "add-todo" when the button is clicked with non-empty input', async () => {
        const wrapper = mount(Input, {
            global: {
                stubs: vuetifyStubs,
            },
        });

        const input = wrapper.find('input');
        const button = wrapper.find('button');

        // Simulate user typing
        await input.setValue('New Todo');

        // Click the button
        await button.trigger('click');

        // Assert the event is emitted
        expect(wrapper.emitted('add-todo')).toHaveLength(1);
        expect(wrapper.emitted('add-todo')[0]).toEqual(['New Todo']);
    });

    it('does not emit "add-todo" when input is empty', async () => {
        const wrapper = mount(Input, {
            global: {
                stubs: vuetifyStubs,
            },
        });

        const button = wrapper.find('button');

        // Click the button without setting input value
        await button.trigger('click');

        // Assert the event is not emitted
        expect(wrapper.emitted('add-todo')).toBeUndefined();
    });

    it('emits "add-todo" when Enter key is pressed', async () => {
        const wrapper = mount(Input, {
            global: {
                stubs: vuetifyStubs,
            },
        });

        const input = wrapper.find('input');

        // Simulate user typing
        await input.setValue('New Todo');

        // Trigger Enter key event
        await input.trigger('keyup.enter');

        // Assert the event is emitted
        expect(wrapper.emitted('add-todo')).toHaveLength(1);
        expect(wrapper.emitted('add-todo')[0]).toEqual(['New Todo']);
    });
});
