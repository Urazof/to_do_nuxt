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
                this.todos = await getTodos(authStore.user.id as string, authStore.token);
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
                await createTodo(newTodo, authStore.token);
                await this.getTodos();
            }
        },

        async removeTodo(id: string) {
            const authStore = useAuthStore();
            await deleteTodo(id, authStore.token);
            await this.getTodos();
        },

        async markAsDone(id: string) {
            const authStore = useAuthStore();
            await updateTodo(id, true, authStore.token);
            await this.getTodos();
        },

        async markAsUndone(id: string) {
            const authStore = useAuthStore();
            await updateTodo(id, false, authStore.token);
            await this.getTodos();
        },
    },
})
