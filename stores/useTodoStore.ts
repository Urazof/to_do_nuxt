import { defineStore } from 'pinia';
import type { Todo } from '@/types/todo';
import { createTodo, getTodos, updateTodo, deleteTodo } from "@/services/api";
import { generateUID } from "@/helpers/uuid";
import { useAuthStore } from '@/stores/useAuthStore';

export const useTodosStore = defineStore('todoStore', {
    state: () => ({
        todos: [] as Todo[],
    }),
    actions: {
        async getTodos() {
            const authStore = useAuthStore();
            if (authStore.user) {
                this.todos = await getTodos(authStore.user.id as string);
            }
        },

        async addTodo(todoText: string) {
            const authStore = useAuthStore();
            if (authStore.user) {
                const newTodo: Todo = {
                    title: todoText,
                    id: generateUID(),
                    isDone: false,
                    userId: authStore.user.id as string
                }
                await createTodo(newTodo);
                await this.getTodos();
            }
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
