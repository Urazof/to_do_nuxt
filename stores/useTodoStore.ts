import { defineStore } from 'pinia';
import type {Todo} from '@/types/todo';
import { createTodo, getTodos, updateTodo, deleteTodo } from "@/services/api";
import { generateUID } from "@/helpers/uuid";

export const useTodosStore = defineStore('todoStore', {
    state: () => ({
        todos: [] as Todo[],
    }),
    actions: {
        async getTodos() {
            console.log('getTodos');
            this.todos = await getTodos();
        },

        async addTodo(todoText: string) {
            const newTodo: Todo = {
                title: todoText,
                id: generateUID(),
                isDone: false,
            }
            await createTodo(newTodo);
            await this.getTodos();
        },

        async removeTodo(id: string) {
            await deleteTodo(id);
            await this.getTodos();
        },

        async markAsDone(id: string) {
            await updateTodo(id, true);
            await this.getTodos();
        },

        async markAsUndone(id: string) {
            await updateTodo(id, false);
            await this.getTodos();
        },
    },
})
